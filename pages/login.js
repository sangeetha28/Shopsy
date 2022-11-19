import Layout from "../components/Layout";
import Login from "../components/Login";
import { getSession } from "next-auth/react";

function LoginPage() {
  return (
    <Layout>
      <Login />
    </Layout>
  );
}

// Login page will only be rendred if the user is not authenticated...
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const query = context.query.redirect;

  if (session) {
    return {
      redirect: { destination: `${query}`, permanent: false },
    };
  }
  return {
    props: { session },
  };
}

export default LoginPage;
