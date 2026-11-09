export interface SiteStat {
  value: number;
  suffix: string;
  label: string;
}

/** Stats come only from Site Settings; a blank or zero value is not shown. */
export function visibleStats(stats?: SiteStat[] | null): SiteStat[] {
  return (stats ?? [])
    .map((stat) => ({ ...stat, value: Number(stat.value) }))
    .filter((stat) => stat.value > 0 && stat.label?.trim());
}
