import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Line, Path, Text as SvgText } from 'react-native-svg';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function toPath(points) {
  if (!points.length) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

export function LineChart({
  width = 320,
  height = 160,
  series = [],
  showLines = true,
  backgroundColor = 'transparent',
  axisColor = 'rgba(0,0,0,0.18)',
  labelColor = 'rgba(0,0,0,0.55)',
}) {
  const padding = 18;
  const innerW = Math.max(10, width - padding * 2);
  const innerH = Math.max(10, height - padding * 2);

  const allValues = useMemo(() => {
    const vals = [];
    for (const s of series) {
      for (const v of s.values || []) vals.push(v);
    }
    return vals;
  }, [series]);

  const maxPoints = useMemo(() => {
    let m = 0;
    for (const s of series) m = Math.max(m, (s.values || []).length);
    return m;
  }, [series]);

  const yMin = 0;
  const yMax = useMemo(() => {
    const m = allValues.length ? Math.max(...allValues) : 1;
    return m <= 0 ? 1 : m;
  }, [allValues]);

  const mapSeries = useMemo(() => {
    const xDen = Math.max(1, maxPoints - 1);
    return series.map((s) => {
      const vals = s.values || [];
      const points = vals.map((v, idx) => {
        const x = padding + (innerW * idx) / xDen;
        const yNorm = (v - yMin) / (yMax - yMin || 1);
        const y = padding + innerH * (1 - clamp(yNorm, 0, 1));
        return { x, y };
      });
      return { ...s, points, path: toPath(points) };
    });
  }, [series, maxPoints, innerW, innerH, padding, yMax]);

  return (
    <View style={{ backgroundColor, borderRadius: 14, overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        {/* axes */}
        <Line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={axisColor} strokeWidth={1} />
        <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={axisColor} strokeWidth={1} />

        {/* y labels */}
        <SvgText x={padding + 4} y={padding + 10} fill={labelColor} fontSize={10}>
          {String(yMax)}
        </SvgText>
        <SvgText x={padding + 4} y={height - padding - 4} fill={labelColor} fontSize={10}>
          0
        </SvgText>

        {/* lines */}
        {showLines
          ? mapSeries.map((s) => (
              <Path
                key={s.id}
                d={s.path}
                stroke={s.color}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))
          : null}
      </Svg>
    </View>
  );
}
