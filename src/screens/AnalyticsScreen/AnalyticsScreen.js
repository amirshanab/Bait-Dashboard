import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler, // Import Filler plugin
} from 'chart.js';
import { db } from '../../firebaseConfig';
import styles from './AnalyticsScreen.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const AnalyticsScreen = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deliveredRevenue, setDeliveredRevenue] = useState(0);
    const [pendingRevenue, setPendingRevenue] = useState(0);
    const [popularItems, setPopularItems] = useState([]);
    const [revenueByCategory, setRevenueByCategory] = useState({});
    const [salesOverTime, setSalesOverTime] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const usersCollection = collection(db, 'Users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = [];
            let deliveredRevenueTotal = 0;
            let pendingRevenueTotal = 0;
            const itemPopularity = {};
            const categoryRevenue = {};
            const salesTimeline = {};

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();
                const userOrdersSnapshot = await getDocs(collection(db, `Users/${userDoc.id}/orders`));

                const orders = userOrdersSnapshot.docs.map(orderDoc => orderDoc.data());

                orders.forEach(order => {
                    const orderRevenue = order.items.reduce((sum, item) => sum + item.Price * item.quantity, 0);

                    if (order.OrderStatus === 'Done') {
                        deliveredRevenueTotal += orderRevenue;
                    } else {
                        pendingRevenueTotal += orderRevenue;
                    }

                    order.items.forEach(item => {
                        if (categoryRevenue[item.Category]) {
                            categoryRevenue[item.Category] += item.Price * item.quantity;
                        } else {
                            categoryRevenue[item.Category] = item.Price * item.quantity;
                        }
                    });


                    if (order.orderDate) {
                        let orderDate;

                        if (order.orderDate.seconds) {
                            orderDate = new Date(order.orderDate.seconds * 1000);
                        } else {
                            orderDate = new Date(order.orderDate);
                        }


                        if (!isNaN(orderDate)) {
                            const orderMonth = `${orderDate.getFullYear()}-${('0' + (orderDate.getMonth() + 1)).slice(-2)}`;
                            if (salesTimeline[orderMonth]) {
                                salesTimeline[orderMonth] += orderRevenue;
                            } else {
                                salesTimeline[orderMonth] = orderRevenue;
                            }
                        } else {
                            console.error("Failed to parse date:", order.orderDate);
                        }
                    }

                    order.items.forEach(item => {
                        if (item.Name in itemPopularity) {
                            itemPopularity[item.Name].count += item.quantity;
                        } else {
                            itemPopularity[item.Name] = { ...item, count: item.quantity };
                        }
                    });
                });

                usersList.push({
                    id: userDoc.id,
                    ...userData,
                    orderCount: orders.length,
                });
            }


            setUsers(usersList);
            setDeliveredRevenue(deliveredRevenueTotal);
            setPendingRevenue(pendingRevenueTotal);
            setPopularItems(Object.values(itemPopularity).sort((a, b) => b.count - a.count).slice(0, 5));
            setRevenueByCategory(
                Object.entries(categoryRevenue)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
            );
            setSalesOverTime(
                Object.entries(salesTimeline)
                    .sort(([a], [b]) => new Date(a) - new Date(b))
                    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
            );
            setLoading(false);
        };

        fetchData().then(() => console.log('Data fetched'));
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const revenueDistributionData = {
        labels: ['Delivered Revenue', 'Pending Revenue'],
        datasets: [
            {
                data: [deliveredRevenue, pendingRevenue],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                hoverBackgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 159, 64, 0.8)'],
            },
        ],
    };

    const popularItemsData = {
        labels: popularItems.map(item => item.Name),
        datasets: [
            {
                data: popularItems.map(item => item.count),
                backgroundColor: popularItems.map((_, index) => `rgba(${(index * 30) % 255}, ${(index * 50) % 255}, ${(index * 70) % 255}, 0.6)`),
                hoverBackgroundColor: popularItems.map((_, index) => `rgba(${(index * 30) % 255}, ${(index * 50) % 255}, ${(index * 70) % 255}, 0.8)`),
            },
        ],
    };

    const revenueByCategoryData = {
        labels: Object.keys(revenueByCategory).map(category => {
            // Split the category path by '/' and take the last part
            const parts = category.split('/');
            return parts[parts.length - 1];
        }),
        datasets: [
            {
                data: Object.values(revenueByCategory),
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                hoverBackgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(153, 102, 255, 0.8)'],
            },
        ],
    };

    const salesOverTimeData = {
        labels: Object.keys(salesOverTime),
        datasets: [
            {
                label: 'Sales Over Time',
                data: Object.values(salesOverTime),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
            },
        ],
    };

    const salesOverTimeOptions = {
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Revenue (in ₪)',
                },
                grid: {
                    borderDash: [8, 4],
                },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Revenue: $${context.raw}`;
                    },
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Store Analytics</h2>
            {loading ? (
                <p>Loading analytics...</p>
            ) : (
                <>
                    <div className={styles.row}>
                        <div className={styles.chartContainer}>
                            <h3>Revenue Distribution</h3>
                            <div className={styles.pieChart}>
                                <Pie data={revenueDistributionData} />
                            </div>
                        </div>

                        <div className={styles.chartContainer}>
                            <h3>Most Ordered Items</h3>
                            <div className={styles.pieChart}>
                                <Pie data={popularItemsData} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.chartContainer}>
                            <h3>Revenue by Category</h3>
                            <div className={styles.pieChart}>
                                <Pie data={revenueByCategoryData} />
                            </div>
                        </div>

                        <div className={styles.chartContainer}>
                            <h3>Sales Over Time</h3>
                            <div className={styles.lineChart}>
                                <Line data={salesOverTimeData} options={salesOverTimeOptions} height={400} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <h3>User Orders</h3>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Number of Orders</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.orderCount}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsScreen;
