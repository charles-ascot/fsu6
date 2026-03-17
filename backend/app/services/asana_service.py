"""
Pushes intelligence summaries to the correct Asana CHI projects.
Each data type maps to a specific CHI project GID.
"""
import httpx
import logging
from datetime import datetime, timezone
from app.core.config import ASANA_PROJECTS
from app.core.secrets import get_asana_token

logger = logging.getLogger(__name__)
ASANA_BASE = "https://app.asana.com/api/1.0"


async def create_task(project_gid: str, name: str, notes: str) -> dict:
    token = get_asana_token()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "data": {
            "name": name,
            "notes": notes,
            "projects": [project_gid],
        }
    }
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(f"{ASANA_BASE}/tasks", headers=headers, json=payload)
        response.raise_for_status()
        return response.json()


def _fmt_date() -> str:
    return datetime.now(timezone.utc).strftime("%d %b %Y")


def _fmt_pl(v) -> str:
    if v is None:
        return "N/A"
    return f"{'+'if v >= 0 else ''}£{abs(v):.2f}"


def _fmt_pct(v) -> str:
    if v is None:
        return "N/A"
    return f"{'+'if v >= 0 else ''}{v:.1f}%"


async def push_daily_performance(data: dict) -> list:
    """Push to CHI-4.1 Daily Performance Reporting"""
    summary = data.get("summary") or {}
    date = _fmt_date()
    pl = summary.get("total_pl", 0)
    strike = summary.get("strike_rate", 0)
    roi = summary.get("roi", 0)
    wins = summary.get("wins", 0)
    losses = summary.get("losses", 0)
    total = summary.get("total_bets", 0)

    name = f"[{date}] Performance: {_fmt_pl(pl)} · {strike:.1f}% strike · {_fmt_pct(roi)} ROI"
    notes = (
        f"DATE: {date}\n\n"
        f"P&L: {_fmt_pl(pl)}\n"
        f"Strike Rate: {strike:.1f}%\n"
        f"ROI: {_fmt_pct(roi)}\n"
        f"Record: {wins}W — {losses}L ({total} bets)\n\n"
        f"Generated automatically by FSU6 — Lay Engine Intelligence Ingest"
    )
    result = await create_task(ASANA_PROJECTS["CHI_4_1_DAILY_PERFORMANCE"], name, notes)
    logger.info("Pushed to CHI-4.1: %s", name)
    return result


async def push_strategy_execution(data: dict) -> dict:
    """Push rule breakdown to CHI-3.2 Strategy Execution Monitoring"""
    bets = data.get("bets") or []
    date = _fmt_date()

    rule_stats = {}
    for bet in bets:
        rule = bet.get("rule", "UNKNOWN")
        if rule not in rule_stats:
            rule_stats[rule] = {"wins": 0, "losses": 0, "pl": 0.0}
        if bet.get("settled"):
            pl = bet.get("pl", 0) or 0
            if pl > 0:
                rule_stats[rule]["wins"] += 1
            else:
                rule_stats[rule]["losses"] += 1
            rule_stats[rule]["pl"] += pl

    lines = []
    for rule, stats in sorted(rule_stats.items()):
        total = stats["wins"] + stats["losses"]
        sr = (stats["wins"] / total * 100) if total > 0 else 0
        lines.append(
            f"{rule}: {stats['wins']}W/{stats['losses']}L · {sr:.0f}% · {_fmt_pl(stats['pl'])}"
        )

    name = f"[{date}] Strategy Execution — {len(rule_stats)} rules fired"
    notes = f"DATE: {date}\n\nRULE BREAKDOWN:\n" + "\n".join(lines) + \
            "\n\nGenerated automatically by FSU6 — Lay Engine Intelligence Ingest"

    result = await create_task(ASANA_PROJECTS["CHI_3_2_STRATEGY_EXEC"], name, notes)
    logger.info("Pushed to CHI-3.2: %s", name)
    return result


async def push_trading_control(data: dict) -> dict:
    """Push engine status to CHI-3.1 Daily Trading Control"""
    state = data.get("state") or {}
    date = _fmt_date()

    running = state.get("engine_running", False)
    countries = ", ".join(state.get("countries", []))
    point_value = state.get("point_value", "N/A")
    dry_run = state.get("dry_run", False)

    status = "LIVE" if running else "OFFLINE"
    mode = " [DRY RUN]" if dry_run else ""

    name = f"[{date}] Engine {status}{mode} — {countries} — £{point_value}/pt"
    notes = (
        f"DATE: {date}\n\n"
        f"Engine Status: {status}{mode}\n"
        f"Active Markets: {countries}\n"
        f"Point Value: £{point_value}\n\n"
        f"Generated automatically by FSU6 — Lay Engine Intelligence Ingest"
    )
    result = await create_task(ASANA_PROJECTS["CHI_3_1_DAILY_TRADING"], name, notes)
    logger.info("Pushed to CHI-3.1: %s", name)
    return result


async def push_eod_reconciliation(data: dict) -> dict:
    """Push settled results to CHI-3.6 End-of-Day Reconciliation"""
    results = data.get("results") or []
    summary = data.get("summary") or {}
    date = _fmt_date()

    settled_today = [r for r in results if r.get("settled")]
    total_settled_pl = sum(r.get("pl", 0) or 0 for r in settled_today)

    name = f"[{date}] EOD Reconciliation — {len(settled_today)} settled — {_fmt_pl(total_settled_pl)}"
    notes = (
        f"DATE: {date}\n\n"
        f"Settled bets today: {len(settled_today)}\n"
        f"Settled P&L: {_fmt_pl(total_settled_pl)}\n"
        f"Cumulative P&L: {_fmt_pl(summary.get('total_pl'))}\n"
        f"Cumulative Strike Rate: {summary.get('strike_rate', 0):.1f}%\n\n"
        f"Generated automatically by FSU6 — Lay Engine Intelligence Ingest"
    )
    result = await create_task(ASANA_PROJECTS["CHI_3_6_EOD_RECONCILIATION"], name, notes)
    logger.info("Pushed to CHI-3.6: %s", name)
    return result


async def push_drawdown(data: dict) -> dict:
    """Push drawdown metrics to CHI-4.4"""
    sessions = data.get("sessions") or []
    date = _fmt_date()

    if sessions:
        pls = [s.get("total_pl", 0) or 0 for s in sessions]
        worst = min(pls)
        best = max(pls)
        cumulative = sum(pls)
    else:
        worst = best = cumulative = 0

    name = f"[{date}] Drawdown Report — worst session {_fmt_pl(worst)}"
    notes = (
        f"DATE: {date}\n\n"
        f"Worst single session: {_fmt_pl(worst)}\n"
        f"Best single session: {_fmt_pl(best)}\n"
        f"Cumulative P&L: {_fmt_pl(cumulative)}\n"
        f"Total sessions: {len(sessions)}\n\n"
        f"Generated automatically by FSU6 — Lay Engine Intelligence Ingest"
    )
    result = await create_task(ASANA_PROJECTS["CHI_4_4_DRAWDOWN"], name, notes)
    logger.info("Pushed to CHI-4.4: %s", name)
    return result


async def push_all(data: dict) -> dict:
    """Run all Asana pushes. Returns results keyed by CHI project."""
    results = {}
    pushes = [
        ("CHI_4_1", push_daily_performance),
        ("CHI_3_2", push_strategy_execution),
        ("CHI_3_1", push_trading_control),
        ("CHI_3_6", push_eod_reconciliation),
        ("CHI_4_4", push_drawdown),
    ]
    for key, fn in pushes:
        try:
            results[key] = await fn(data)
        except Exception as e:
            logger.error("Push failed for %s: %s", key, str(e))
            results[key] = {"error": str(e)}
    return results
