import React, { useEffect, useMemo, useRef, useState } from "react";
import * as classes from "./RegisteredUsersChart.module.css";
import { useToast } from "@/components/UI/Toast";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Utilidades de fechas
function formatDay(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeekISO(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (0 domingo)
  const diff = (day === 0 ? -6 : 1) - day; // mover a lunes
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthLabel(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getSafeUsersWithDates(rawUsers) {
  const users = Array.isArray(rawUsers) ? rawUsers : [];
  const today = new Date();
 
  return users.map((u, idx) => {
    if (u.registeredAt) return u;
    const fallback = new Date(today);
    const offset = (idx % 30) + 1; 
    fallback.setDate(today.getDate() - offset);
    return { ...u, registeredAt: fallback.toISOString() };
  });
}

function getWeekRange(start, end) {
  const weeks = [];
  let cur = startOfWeekISO(start);
  const last = startOfWeekISO(end);

  while (cur <= last) {
    weeks.push(new Date(cur));
    cur.setDate(cur.getDate() + 7);
  }

  return weeks;
}

function getMonthRange(start, end) {
  const months = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cur <= last) {
    months.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  return months;
}


export default function RegisteredUsersChart({ users = [], startDate, endDate, aggregation = "day" }) {
  const { showToast } = useToast();
  const [data, setData] = useState([]); // [{ label, count }]
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null); // { label, count, idx }
  const chartRef = useRef(null);

  const range = useMemo(() => {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    const cur = new Date(start);
    cur.setHours(0, 0, 0, 0);
    while (cur <= end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [startDate, endDate]);

  useEffect(() => {
    try {
      const usersWithDates = getSafeUsersWithDates(users);

      // Filtrar por rango
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const inRange = usersWithDates.filter((u) => {
        const d = new Date(u.registeredAt);
        if (!start || !end || Number.isNaN(d.getTime())) return false;
        d.setHours(0, 0, 0, 0);
        return d >= start && d <= end;
      });

      setTotal(inRange.length);

      if (inRange.length === 0) {
        setData([]);
        showToast("No hay datos en el rango seleccionado", { type: "warning" });
        return;
      }

      // Agregaciones
      const map = new Map();
      if (aggregation === "day") {
        // asegurar etiquetas por cada día del rango, aunque cuenten 0
        range.forEach((d) => map.set(formatDay(d), 0));
        inRange.forEach((u) => {
          const d = new Date(u.registeredAt);
          const label = formatDay(d);
          map.set(label, (map.get(label) || 0) + 1);
        });
      } else if (aggregation === "week") {
        const weeks = getWeekRange(start, end);

        // inicializar semanas en 0
        weeks.forEach((w) => {
          const label = `Semana ${formatDay(w)}`;
          map.set(label, 0);
        });

        // sumar usuarios
        inRange.forEach((u) => {
          const d = new Date(u.registeredAt);
          const sow = startOfWeekISO(d);
          const label = `Semana ${formatDay(sow)}`;
          map.set(label, map.get(label) + 1);
        });
      } else {
        const months = getMonthRange(start, end);

        // inicializar meses en 0
        months.forEach((m) => {
          const label = monthLabel(m);
          map.set(label, 0);
        });

        // sumar usuarios
        inRange.forEach((u) => {
          const d = new Date(u.registeredAt);
          const label = monthLabel(d);
          map.set(label, map.get(label) + 1);
        });
      }

      const arr = Array.from(map.entries()).map(([label, count]) => ({ label, count }));

      // Orden cronológico para day, y alfabético para otros
      if (aggregation === "day") {
        arr.sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
      } else if (aggregation === "month") {
        arr.sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
      }

      setData(arr);
      setSelected(null);
    } catch (e) {
      setData([]);
      setTotal(0);
      showToast("Error cargando datos de usuarios", { type: "error" });
    }
  }, [users, startDate, endDate, aggregation, range, showToast]);

  const max = data.reduce((m, d) => Math.max(m, d.count), 0);
  const labels = useMemo(() => data.map((d) => d.label), [data]);
  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Usuarios registrados",
        data: data.map((d) => d.count),
        borderColor: "#388e3c",
        backgroundColor: "rgba(56,142,60,0.18)",
        tension: 0.25,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [labels, data]);

  const chartOptions = useMemo(() => {
    const step = Math.max(1, Math.ceil(max / 5));
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest", intersect: true },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (items) => (items?.[0]?.label ?? ""),
            label: (ctx) => `${ctx.parsed.y} usuarios`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 0, autoSkip: true },
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: step },
          suggestedMax: max + step,
          grid: { color: "rgba(0,0,0,0.08)" },
        },
      },
      elements: { line: { borderWidth: 2 }, point: { radius: 3 } },
      events: ["mousemove", "click"],
    };
  }, [max]);

  const handleChartClick = (event) => {
    const chart = chartRef.current;
    if (!chart) return;
    const ev = event?.native || event;
    const elems = chart.getElementsAtEventForMode(ev, "nearest", { intersect: true }, true);
    if (!elems || !elems.length) return;
    const idx = elems[0].index;
    const label = labels[idx];
    const count = data[idx]?.count ?? 0;
    setSelected({ idx, label, count });
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.summaryRow}>
        <div className={classes.summaryBox}>
          <div className={classes.summaryLabel}>Total en el rango</div>
          <div className={classes.summaryValue}>{total}</div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className={classes.empty}>Sin datos para mostrar</div>
      ) : (
        <div className={classes.chartLine} role="img" aria-label="Gráfico de usuarios registrados (línea)">
          <div className={classes.lineChartWrap}>
            <Line ref={chartRef} data={chartData} options={chartOptions} onClick={handleChartClick} />
          </div>
          {selected && (
            <div className={classes.tooltipFixed}>
              <div className={classes.tooltipLabel}>{selected.label}</div>
              <div className={classes.tooltipValue}>{selected.count} usuarios</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
