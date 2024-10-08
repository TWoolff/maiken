
import css from './video.module.css'

const Video: React.FC = () => {
  return ( 
    <section className={css.videocontainer}>
      <video className={css.video} autoPlay loop muted playsInline>
        <source src="/assets/video/seaweed.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </section>
  )
}

export default Video