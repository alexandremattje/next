import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import Head from "next/head";
import { getSession } from "next-auth/react"

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Head>Meu painel de tarefas</Head>
            <h1>Paginal Painel</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}