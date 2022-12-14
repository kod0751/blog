import Head from "next/head";
import Layout from "../../components/Layout";
import { getPostData, getAllPostIds } from "../../lib/posts";
import Date from "../../components/Date";
import utilStyles from "../../styles/utils.module.css";
import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import CodeBlock from "../../components/CodeBlock";
// import Button from "../../components/Button";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("../../components/Button"), {
  loading: () => <div>Loading...</div>,
});

export async function getStaticPaths() {
  const paths = getAllPostIds();
  // const paths = [
  //   {
  //     params: {
  //       id: "ssg-ssr",
  //     },
  //   },
  // ];
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params, preview }) {
  console.log(`>>>>>> ${preview}`);
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

const components = { Button, CodeBlock };

export default function FirstPost({ postData }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <Layout>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <br />
        {postData.contentHtml && (
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        )}
        {postData.mdxSource && (
          <MDXRemote {...postData.mdxSource} components={components} />
        )}
      </article>
    </Layout>
  );
}
