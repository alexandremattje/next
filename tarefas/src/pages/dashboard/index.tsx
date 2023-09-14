import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import { getSession } from "next-auth/react"
import Head from "next/head";
import { TextArea } from "@/components/textarea";
import { CheckBox } from "@/components/checkbox";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebase";


interface Task {
    text: string,
    public: boolean,
}

interface DashboardProps {
    user: {
        email: string
    }
}

export default function Dashboard(props: DashboardProps) {
    const [task, setTask] = useState<Task>({text: "", public: false});

    const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setTask({
            ...task,
            text: event.target.value
        })
    }

    const onCheckBoxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTask({
            ...task,
            public: event.target.checked
        })
    }

    const onSubmitForm = async (event: FormEvent) => {
        event.preventDefault();

        if (task.text === "") {
            return
        } else {
            try {
                await addDoc(collection(db, "task"), {
                    ...task,
                    createdAt: new Date(),
                    user: props.user?.email
                })
                setTask({text: "", public: false});
            } catch(err) {
                console.log(err)
            }


        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual a sua tarefa?</h1>
                        <form onSubmit={onSubmitForm}>
                            <TextArea 
                                placeholder="Digite qual sua tarefa?"
                                value={task.text}
                                onChange={onTextChange}
                            />
                            <CheckBox 
                                label="Deixar tarefa pública?"
                                checked={task.public}
                                onChange={onCheckBoxChange}
                            />
                            <button className={styles.button} type="submit">
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>

                    <article className={styles.task}>
                        <div className={styles.tagContainer}>
                            <label className={styles.tag}>Público</label>
                            <button className={styles.shareButton}>
                                <FiShare2
                                    size={22}
                                    color="#3183ff"
                                />
                            </button>
                        </div>
                        <div className={styles.taskContent}>
                            <p>Minha primeira tarefa de exemplo show demais</p>
                            <button className={styles.trashButton}>
                                <FaTrash size={24} color="#ea3140"/>
                            </button>
                        </div>
                    </article>
                </section>
            </main>
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
            user: {
                email: session?.user?.email
            }
        }
    }
}