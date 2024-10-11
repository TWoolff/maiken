import css from './loader.module.css';

const Loader = () => {
  return ( 
    <section className={css.loader}>
      <div className={css.spinner} />
    </section>
  );
}

export default Loader;