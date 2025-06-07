import { useEffect, useState } from 'react';
import axios from 'axios';

export function useYearMonthList({ sellerId, token }) {
  const [yearMonthList, setYearMonthList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId || !token) return;
    async function fetchYears() {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.citycentermall.com/api/v1/orders/seller/${sellerId}?limit=1000`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const orders = res.data.data || [];
        const yearsSet = new Set();
        orders.forEach(order => {
          if (order.date_added) {
            const year = new Date(order.date_added).getFullYear();
            yearsSet.add(year);
          }
        });
        const years = Array.from(yearsSet).sort((a, b) => b - a);
        const months = [
          { label: "Jan", value: 1, type: 'month' },
          { label: "Feb", value: 2, type: 'month' },
          { label: "Mar", value: 3, type: 'month' },
          { label: "Apr", value: 4, type: 'month' },
          { label: "May", value: 5, type: 'month' },
          { label: "Jun", value: 6, type: 'month' },
          { label: "Jul", value: 7, type: 'month' },
          { label: "Aug", value: 8, type: 'month' },
          { label: "Sep", value: 9, type: 'month' },
          { label: "Oct", value: 10, type: 'month' },
          { label: "Nov", value: 11, type: 'month' },
          { label: "Dec", value: 12, type: 'month' },
        ];
        setYearMonthList([
          ...years.map(y => ({ label: String(y), value: y, type: 'year' })),
          ...months,
        ]);
      } catch (err) {
        setYearMonthList([
          { label: "Jan", value: 1, type: 'month' },
          { label: "Feb", value: 2, type: 'month' },
          { label: "Mar", value: 3, type: 'month' },
          { label: "Apr", value: 4, type: 'month' },
          { label: "May", value: 5, type: 'month' },
          { label: "Jun", value: 6, type: 'month' },
          { label: "Jul", value: 7, type: 'month' },
          { label: "Aug", value: 8, type: 'month' },
          { label: "Sep", value: 9, type: 'month' },
          { label: "Oct", value: 10, type: 'month' },
          { label: "Nov", value: 11, type: 'month' },
          { label: "Dec", value: 12, type: 'month' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchYears();
  }, [sellerId, token]);

  return { yearMonthList, loading };
}