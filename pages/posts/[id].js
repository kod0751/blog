import Head from "next/head";
import Layout from "../../components/Layout";
import { getPostData, getAllPostIds } from "../../lib/posts";
import Date from "../../components/Date";
import utilStyles from "../../styles/utils.module.css";
import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import CodeBlock from "../../components/CodeBlock";

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

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

const Button = ({ children }) => {
  return (
    <button
      className="bg-black dark:bg-white text-lg text-teal-200 dark:text-teal-700 rounded-lg px-5"
      onClick={() => alert(`thanks to ${children}`)}
    >
      {children}
    </button>
  );
};

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
        <div className={utilStyles.lightText}></div>
        <Date dateString={postData.date} />
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
