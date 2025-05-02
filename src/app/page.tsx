import styles from '~/styles/page.module.css';
import { TodoCreator } from '~/widgets/todoCreator';
import { TodoList } from '~/widgets/todoList';

export default () => {
  return (
    <main className={styles.main}>
      <TodoCreator />
      <TodoList />
    </main>
  );
};
