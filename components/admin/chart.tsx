import { useEffect, useRef, useState } from "react";

import { Chart } from "chart.js/auto";

interface DashboardData {
    categoryCount?: number;
    customerCount?: number;
    invoiceCount?: number;
    invoiceDetailsCount?: number;
    paymentCount?: number;
    paymentDetailsCount?: number;
    productCount?: number;
    orderCount?: number;
    subscriptionCount?: number;
    supplierCount?: number;
    unitCount?: number;
}

interface ChartItem {
    name: string;
    count: number;
}

const ChartDisplay = () => {

    const [data, setData] = useState<DashboardData>({});

    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const lineChartRef = useRef<HTMLCanvasElement>(null);
    const barChartInstance = useRef<Chart | null>(null);
    const pieChartInstance = useRef<Chart | null>(null);
    const lineChartInstance = useRef<Chart | null>(null);


    const toArray = (obj: DashboardData): ChartItem[] => [
        { name: 'Categories', count: obj.categoryCount || 5 },
        { name: 'Customers', count: obj.customerCount || 10 },
        { name: 'Invoices', count: obj.invoiceCount || 20 },
        { name: 'Invoice Details', count: obj.invoiceDetailsCount || 25 },
        { name: 'Payments', count: obj.paymentCount || 18 },
        { name: 'Payment Details', count: obj.paymentDetailsCount || 22 },
        { name: 'Products', count: obj.productCount || 15 },
        { name: 'Orders', count: obj.orderCount || 8 },
        { name: 'Subscriptions', count: obj.subscriptionCount || 30 },
        { name: 'Suppliers', count: obj.supplierCount || 12 },
        { name: 'Units', count: obj.unitCount || 6 },
    ];


    const bgColors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#C9CBCF",
        "#E74C3C",
        "#8E44AD",
        "#F39C12",
        "#96CEB4",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.API}/admin/home`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchData();
    }, []);


    useEffect(() => {

        if (barChartRef.current) {
            const chartData = toArray(data);
            if (barChartInstance.current) {
                barChartInstance.current.destroy(); // runs when data changes
            }

            barChartInstance.current = new Chart(barChartRef.current, {
                type: "bar",
                data: {
                    labels: toArray(data).map((item) => item.name),
                    datasets: [
                        {
                            label: "Count",
                            data: toArray(data).map((item) => item.count),
                            backgroundColor: bgColors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            return () => {
                // Runs when component unmounts or useEffect dependencies change
                if (barChartInstance.current) {
                    barChartInstance.current.destroy();
                }
            };
        }
    }, [data]);

    useEffect(() => {
        if (pieChartRef.current) {
            const chartData = toArray(data);

            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }

            pieChartInstance.current = new Chart(pieChartRef.current, {
                type: "pie",
                data: {
                    labels: chartData.map((item) => item.name),
                    datasets: [
                        {
                            data: chartData.map((item) => item.count),
                            backgroundColor: bgColors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                },
            });

            return () => {
                if (pieChartInstance.current) {
                    pieChartInstance.current.destroy();
                }
            };
        }
    }, [data]);

    useEffect(() => {
        if (lineChartRef.current) {
            const chartData = toArray(data);

            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }

            lineChartInstance.current = new Chart(lineChartRef.current, {
                type: "line",
                data: {
                    labels: chartData.map((item) => item.name),
                    datasets: [
                        {
                            data: chartData.map((item) => item.count),
                            backgroundColor:bgColors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                },
            });

            return () => {
                if (lineChartInstance.current) {
                    lineChartInstance.current.destroy();
                }
            };
        }
    }, [data]);


    return (
        <div style={{padding: '20px'}}>
            <h1>Bar Chart</h1>
            <canvas ref={barChartRef} width="400" height="200"></canvas>

            <h1>Pie Chart</h1>
            <canvas ref={pieChartRef} height="900"></canvas>

            <h1>Line Chart</h1>
            <canvas ref={lineChartRef} width="400" height="200"></canvas>
        </div>
    )
}

export default ChartDisplay;