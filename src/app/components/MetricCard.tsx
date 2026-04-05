import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}

export function MetricCard({ title, value, icon: Icon, description, onClick, children, className = '' }: MetricCardProps) {
    return (
        <Card
            className={`${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                <Icon className="h-5 w-5 text-[#2C5F8D]" />
            </CardHeader>
            <CardContent>
                {children ? (
                    children
                ) : (
                    <>
                        <div className="text-2xl font-bold text-gray-900">{value}</div>
                        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
