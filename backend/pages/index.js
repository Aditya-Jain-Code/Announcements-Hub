import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineController, plugins } from "chart.js";
import { Bar } from "react-chartjs-2";
import Loading from "@/components/Loading";

export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();

  ChartJS.register(CategoryScale, LineController, LinearScale, BarElement, Title, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'News created monthly by year'
      }
    }
  }

  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/newsapi');
        const data = await response.json();
        setNewsData(data);
      } catch (error) {
        console.log("Error fetching data", error)
      }
    }

    fetchData();
  }, []);

  const categories = ['academics', 'placements', 'curricular', 'events'];

  const categoryCounts = categories.map(category => ({
    category,
    count: newsData.filter(item =>
      item.status === 'publish' &&
      item.newscategory === category
    ).length
  }));

  const toTitleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const monthlyData = newsData.filter(data => data.status === 'publish').reduce((acc, news) => {
    const year = new Date(news.createdAt).getFullYear();
    const month = new Date(news.createdAt).getMonth();
    acc[year] = acc[year] || Array(12).fill(0);
    acc[year][month]++;
    return acc;
  }, {});

  const currentYear = new Date().getFullYear();
  const years = Object.keys(monthlyData);
  const labels = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const datasets = years.map(year => ({
    label: `${year}`,
    data: monthlyData[year] || Array(12).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`
  }))

  const data = {
    labels,
    datasets
  };

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Admin Dashboard</title>
          <meta name="description" content="admin dashboard next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="dashboard">
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>News <span>Dashboard</span></h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="slide-left">
              <IoHome /> <span>/</span> <span>Dashboard</span>
            </div>
          </div>

          <div className="topfourcards flex flex-sb">
            <div className="four_card" data-aos="fade-right">
              <h2>Total News</h2>
              <span>{newsData.filter(ab => ab.status === 'publish').length}</span>
            </div>
            <div className="four_card" data-aos="fade-right">
              <h2>Topics</h2>
              <span>4</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Tags</h2>
              <span>9</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Draft News</h2>
              <span>{newsData.filter(ab => ab.status === 'draft').length}</span>
            </div>
          </div>

          <div className="year_overview flex flex-sb">
            <div className="leftyearoverview" data-aos="fade-up">
              <div className="flex flex-sb">
                <h3>Year Overview</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <div className="small-dot"></div>
                </ul>
                <h3 className="text-right">Total Published<br /> <span>News: {newsData.filter(ab => ab.status === 'publish').length}</span></h3>
              </div>
              <Bar data={data} options={options} />
            </div>

            <div className="right_salescont" data-aos="fade-up">
              <div>
                <h3>News By Category</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <div className="small-dot"></div>
                </ul>
              </div>

              <div className="newscategory flex flex-center">
                <table>
                  <thead>
                    <tr>
                      <td>Topics</td>
                      <td>Data</td>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryCounts.map(({ category, count }) => (
                      <tr key={category}>
                        <td>{toTitleCase(category)}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
