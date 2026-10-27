import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BudgetItem, formatCurrency } from '../../lib/schema';

const PALETTE = [
  '#D9695F', // Warm coral
  '#C9A25B', // Gold
  '#5B3A57', // Plum
  '#7E9F7A', // Sage
  '#E07A5F', // Terra cotta
  '#8198A5', // Slate
  '#A0717F'  // Mauve
];

interface BudgetDonutChartProps {
  budgetRows: BudgetItem[];
  totalBudget: number;
  currency: string;
}

/**
 * Code-split Donut Chart for Budget Allocation
 */
export default function BudgetDonutChart({
  budgetRows,
  totalBudget,
  currency
}: BudgetDonutChartProps) {
  return (
    <div className="w-full h-56 relative" role="img" aria-label={`Budget breakdown donut chart totaling ${formatCurrency(totalBudget, currency)}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={budgetRows}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={88}
            paddingAngle={3}
          >
            {budgetRows.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown) => [formatCurrency(Number(value) || 0, currency), 'Amount']}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#EDE4DB',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(91,58,87,0.08)',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Total Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Total Budget</span>
        <span className="font-serif text-xl sm:text-2xl font-bold text-text">
          {formatCurrency(totalBudget, currency)}
        </span>
        <span className="text-[10px] font-bold text-[#7E9F7A]">100% Balanced</span>
      </div>
    </div>
  );
}
