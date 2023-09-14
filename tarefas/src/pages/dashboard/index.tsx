import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import { getSession } from "next-auth/react"
import Head from "next/head";
import { TextArea } from "@/components/textarea";
import { CheckBox } from "@/components/checkbox";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useState } from "react";
import { addDoc, collection, query, orderBy, where, onSnapshot, DocumentData, CollectionReference, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import Link from "next/link";


interface Task extends DocumentData {
    id: string | undefined,
    text: string | undefined,
    public: boolean | undefined,
    createdAt: Date | undefined,
    user: string | undefined
}

interface DashboardProps {
    user: {
        email: string
    }
}

export default function Dashboard(props: DashboardProps) {
    const [task, setTask] = useState<Task>({} as Task);
    const [tasks, setTasks] = useState<Array<Task>>([]);
    useEffect(() => {
        const loadTasks = async () => {
            const task: CollectionReference<Task, Task> = collection(db, "task") as CollectionReference<Task, Task>;
            const q = query<Task, Task>(task,
                orderBy("createdAt", "desc"),
                where("user", "==", props.user.email)
                );
            onSnapshot(q, (snapshot) => {
                const temp: Array<Task> = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        ... doc.data(),
                        id: doc.id,
                    })
                })
                setTasks(temp)
            })
        }

        loadTasks();

    }, [props.user.email])

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
                setTask({} as Task);
            } catch(err) {
                console.log(err)
            }


        }
    }

    const onShareClick = async (id: string | undefined) => {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        )
    }

    const onDeleteClick = async (id: string | undefined) => {
        if (id) {
            const docRef = doc(db, "task", id);
            await deleteDoc(docRef);
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

                    { tasks.map((task) => (
                        <article key={task.id} className={styles.task}>
                            { task.public && (
                                <div className={styles.tagContainer}>
                                    <label className={styles.tag}>Público</label>
                                    <button className={styles.shareButton} onClick={() => onShareClick(task.id)}>
                                        <FiShare2
                                            size={22}
                                            color="#3183ff"
                                        />
                                    </button>
                                </div>
                            )}
                            <div className={styles.taskContent}>
                                {task.public ? (
                                    <Link href={`/task/${task.id}`}>
                                        <p>{task.text}</p>
                                    </Link>
                                ) : (
                                    <p>{task.text}</p>
                                )}
                                <button className={styles.trashButton} onClick={() => onDeleteClick(task.id)}>
                                    <FaTrash size={24} color="#ea3140"/>
                                </button>
                            </div>
                        </article>
                    ))}
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