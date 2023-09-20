import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/home.module.css'
import Image from 'next/image';
import { GetStaticProps } from "next";

import heroImg from "../../public/assets/hero.png";
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';

const inter = Inter({ subsets: ['latin'] })

interface HomeProps {
  postsCount: number,
  commentsCount: number
}
export default function Home(props: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image className={styles.hero}
            alt="Logo Tarefas"
            src={heroImg}
            priority
            />
        </div>
        <h1 className={styles.title}>
          Sistema feito para vocês organizar <br />
          seus estudos e tarefas
        </h1> 
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{props.postsCount} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{props.commentsCount} comentários</span>
          </section>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments");
  const postRef = collection(db, "task");
  const snapshotComments = await getDocs(commentRef);
  const snapshotPosts = await getDocs(postRef);
  return {
    props: {
      postsCount: snapshotPosts.size || 0,
      commentsCount: snapshotComments.size || 0
    },
    revalidate: 60
  }
}
