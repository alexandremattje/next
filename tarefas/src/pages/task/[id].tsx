import Head from "next/head"
import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import { db } from "@/services/firebase";
import {
    doc, 
    collection,
    query,
    where,
    getDoc,
    getDocs,
    DocumentReference,
    addDoc,
    CollectionReference,
    FirestoreDataConverter
} from "firebase/firestore";
import { Comment, CommentDB, Task, TaskDB } from "@/models/task";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TextArea } from "@/components/textarea";


interface TaskProps {
    task: Task,
    comments: Comment[]
}

export default function Task(props: TaskProps) {
    const { data: session } = useSession();
    const [ comment, setComment ] = useState("");
    const [ comments, setComments ] = useState<Comment[]>(props.comments || [])

    const commentOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value)
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (comment === "") {
            return
        }
        if (!session?.user?.email || !session?.user?.name) {
            return
        }
        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment,
                createdAt: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: props.task.id
            });
            setComment("")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>{props.task.text}</p>
                </article>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixar comentários</h2>
                <form onSubmit={handleSubmit}>
                    <TextArea
                        placeholder="Digite seu comentário"
                        value={comment}
                        onChange={commentOnChange}

                    />
                    <button className={styles.button}
                        disabled={!session?.user}
                        type="submit"
                    >
                        Enviar comentário
                    </button>
                </form>
            </section>
            {comments.map((item) => (
               <article key={item.id} className={styles.comment}>
                    <p>{item.comment}</p>
               </article>
            ))}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string

    const docRef: DocumentReference<TaskDB, TaskDB> = doc(db, "task", id);
    const snapshot = await getDoc<TaskDB, TaskDB>(docRef);

    if (snapshot.data() == undefined || !snapshot.data()?.public) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    } else {
        const commentCollection: CollectionReference<CommentDB, CommentDB> = collection(db, "comments") as CollectionReference<CommentDB, CommentDB>;

        const qComments = query<CommentDB, CommentDB>(
            commentCollection,
            where("taskId", "==", id));
        const snapshotComments = await getDocs<CommentDB, CommentDB>(qComments);
        const comments: Comment[] = [];
        snapshotComments.forEach((commentDB) => {
            const comment: Comment = {
                ...commentDB.data(),
                id: commentDB.id,
                createdAt: new Date(commentDB.data()?.createdAt as Date).toLocaleDateString()
            }
            comments.push(comment)
        })
        const task: Task = {
            ...snapshot.data(),
            id: snapshot.id,
            createdAt: new Date(snapshot.data()?.createdAt as Date).toLocaleDateString()
        }
        return {
            props: {
                task,
                comments
            }
        }
    }
    
} 