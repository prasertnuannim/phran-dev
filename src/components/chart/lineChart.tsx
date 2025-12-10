type Dataset = {
  label: string;
  data: number[];
};

type LineChartProps = {
  data: {
    labels: string[];
    datasets: Dataset[];
  };
};

/**
 * Minimal placeholder chart to avoid missing dependency errors.
 * Renders the provided labels and dataset values as a simple list.
 */
export default function LineChart({ data }: LineChartProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex gap-2 text-sm text-gray-600">
        {data.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-2 space-y-2">
        {data.datasets.map((set) => (
          <div key={set.label} className="text-sm">
            <div className="font-medium text-gray-800">{set.label}</div>
            <div className="flex gap-2">
              {set.data.map((value, idx) => (
                <span key={`${set.label}-${idx}`} className="rounded bg-gray-100 px-2 py-1 text-gray-700">
                  {value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
