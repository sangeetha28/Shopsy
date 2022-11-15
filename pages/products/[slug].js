import { useRouter } from "next/router";
import data from "../../util/data";
import Layout from "../../components/Layout";
import Details from "../../components/Detail/index";

export default function ProductDetailsPage() {
  const {
    query: { slug },
  } = useRouter();

  const product = data.products.find((product) => product.slug === slug);

  if (!product) {
    return <p>Product Not Found!</p>;
  }

  return (
    <Layout>
      <Details product={product} />
    </Layout>
  );
}
