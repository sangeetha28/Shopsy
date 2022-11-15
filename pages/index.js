import Layout from "../components/Layout/index";
import data from "../util/data";
import ProductListItem from "../components/ProductItemList/index";

export default function Home() {
  return (
    <Layout>
      <ProductListItem products={data.products} />
    </Layout>
  );
}
