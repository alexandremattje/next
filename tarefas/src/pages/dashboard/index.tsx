import styles from "./styles.module.css";
import Head from "next/head";

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <Head>Meu painel de tarefas</Head>
            <h1>Paginal Painel</h1>
        </div>
    )
}