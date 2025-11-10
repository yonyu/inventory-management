import { useEffect, useRef, useState } from "react";

import { Chart } from "chart.js/auto";

const ChartDisplay = () => {

    const [data, setData] = useState<{
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
    }>({});

    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const lineChartRef = useRef<HTMLCanvasElement>(null);

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
            const chartData = [
                { name: 'Categories', count: data.categoryCount || 5 },
                { name: 'Customers', count: data.customerCount || 10 },
                { name: 'Invoices', count: data.invoiceCount || 20 },
                { name: 'Invoice Details', count: data.invoiceDetailsCount || 25 },
                { name: 'Payments', count: data.paymentCount || 18 },
                { name: 'Payment Details', count: data.paymentDetailsCount || 22 },
                { name: 'Products', count: data.productCount || 15 },
                { name: 'Orders', count: data.orderCount || 8 },
                { name: 'Subscriptions', count: data.subscriptionCount || 30 },
                { name: 'Suppliers', count: data.supplierCount || 12 },
                { name: 'Units', count: data.unitCount || 6 },
            ];

            const barChart = new Chart(barChartRef.current, {
                type: "bar",
                data: {
                    labels: chartData.map((item) => item.name),
                    datasets: [
                        {
                            label: "Count",
                            data: chartData.map((item) => item.count),
                            backgroundColor:
                            [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#4BC0C0",
                                "#9966FF",                                
                                "#FF9F40",
                                "#C9CBCF",
                                "#36A2EB",
                                "#FF6384",
                                "#4BC0C0",
                                "#9966FF",
                            ],
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
                barChart.destroy();
            };
        }
    }, [data]);

    useEffect(() => {
        if (pieChartRef.current) {
            const chartData = [
                { name: 'Categories', count: data.categoryCount || 5 },
                { name: 'Customers', count: data.customerCount || 10 },
                { name: 'Invoices', count: data.invoiceCount || 20 },
                { name: 'Invoice Details', count: data.invoiceDetailsCount || 25 },
                { name: 'Payments', count: data.paymentCount || 18 },
                { name: 'Payment Details', count: data.paymentDetailsCount || 22 },
                { name: 'Products', count: data.productCount || 15 },
                { name: 'Orders', count: data.orderCount || 8 },
                { name: 'Subscriptions', count: data.subscriptionCount || 30 },
                { name: 'Suppliers', count: data.supplierCount || 12 },
                { name: 'Units', count: data.unitCount || 6 },
            ];

            const pieChart = new Chart(pieChartRef.current, {
                type: "pie",
                data: {
                    labels: chartData.map((item) => item.name),
                    datasets: [
                        {
                            data: chartData.map((item) => item.count),
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#4BC0C0",
                                "#9966FF",
                                "#FF9F40",
                                "#C9CBCF",
                                "#FF6B6B",
                                "#4ECDC4",
                                "#45B7D1",
                                "#96CEB4",
                            ],
                        },
                    ],
                },
                options: {
                    responsive: true,
                },
            });

            return () => {
                pieChart.destroy();
            };
        }
    }, [data]);

    return (
        <div style={{padding: '20px'}}>
            <h1>Bar Chart</h1>
            <canvas ref={barChartRef} width="400" height="200"></canvas>

            <h1>Pie Chart</h1>
            <canvas ref={pieChartRef} height="900"></canvas>

            {/* <h1>Line Chart</h1>
            <canvas ref={barChartRef} width="400" height="200"></canvas> */}
        </div>
    )
}

export default ChartDisplay;