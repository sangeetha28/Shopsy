import Layout from "../components/Layout";
import Checkout from "../components/Checkout";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";

function CheckoutPage() {
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/";
      } else {
        setisLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <p
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            Color: "purple",
          }}
        >
          Loading...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Checkout />
    </Layout>
  );
}

// Checkout page will only be rendred if the user is authenticated...
// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

//   if (session) {
//     return {
//       redirect: { destination: `/`, permanent: false },
//     };
//   }
//   return {
//     props: { session },
//   };
// }

export default CheckoutPage;
