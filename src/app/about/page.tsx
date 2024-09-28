import css from './about.module.css'

const About: React.FC = () => {
  return ( 
    <section className={css.about}>
      <h1>About</h1>
      <p>This is the about page</p>
    </section>
  )
}

export default About