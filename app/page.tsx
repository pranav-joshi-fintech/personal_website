import About from "@/app/components/about/About";
import Experience from "@/app/components/experience/Experience";
import Academics from "@/app/components/academics/Academics";
import Projects from "@/app/components/projects/Projects";

export default function Home() {
    return (
        <main className="space-y-20">
            <About />
            <Experience />
            <Academics />
            <Projects />
        </main>
    );
}
