import {Link} from "react-router-dom"
function HeroSection()
{
    return (
        <>
            <section className="hero-section">
                <h1 className="hero-heading"><span className="highlight highlight-secondary">Campus delivery,</span> powered by students for students </h1>
                <p className="hero-paragraph">A smart peer-to-peer assistance network that connects hostel students with nearby helpers for urgent academic and daily needs</p>
                <ul className="hero-btn-container">
                    <li><Link to="/register" className="btn btn-primary" >Get started</Link></li>
                    <li><a className="btn btn-primary-outline" href="#features">Learn more</a></li>
                </ul>
            </section> 
        </>
    )
}
export default HeroSection;