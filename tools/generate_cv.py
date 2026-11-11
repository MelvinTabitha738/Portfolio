"""Generate Melvin Tabitha's CV and Resume as PDFs that match the look and
tone of the original documents: Times serif, action-verb bullets, first
person voice ("I ..."), no em dashes, standard compound hyphens only.

Run from anywhere with ReportLab installed:  python tools/generate_cv.py
Both PDFs are written to cv/ at the repository root.
"""

from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, black
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    KeepTogether, ListFlowable, ListItem,
)

# ---- Output paths ----------------------------------------------------------
CV_DIR = Path(__file__).resolve().parent.parent / "cv"
CV_PDF = CV_DIR / "Melvin-Tabitha-CV.pdf"
RESUME_PDF = CV_DIR / "Melvin-Tabitha-Resume.pdf"

# ---- Palette ---------------------------------------------------------------
INK = HexColor("#111111")
MUTED = HexColor("#333333")
FAINT = HexColor("#555555")
RULE = HexColor("#555555")
LINK = HexColor("#1f3b73")

# ---- Styles (Times family, matching the original CV look) ------------------
def mk_styles():
    return dict(
        name=ParagraphStyle(
            "name", fontName="Times-Bold", fontSize=22,
            leading=26, textColor=INK, spaceAfter=2,
        ),
        tagline=ParagraphStyle(
            "tagline", fontName="Times-Italic", fontSize=10.5,
            leading=14, textColor=MUTED, spaceAfter=2,
        ),
        contact=ParagraphStyle(
            "contact", fontName="Times-Roman", fontSize=10.5,
            leading=13, textColor=MUTED, spaceAfter=10,
        ),
        section=ParagraphStyle(
            "section", fontName="Times-Bold", fontSize=11.5,
            leading=14, textColor=INK,
            spaceBefore=10, spaceAfter=1,
        ),
        subhead=ParagraphStyle(
            "subhead", fontName="Times-Bold", fontSize=10.75,
            leading=14, textColor=INK, spaceBefore=5, spaceAfter=0,
        ),
        role=ParagraphStyle(
            "role", fontName="Times-Bold", fontSize=10.5,
            leading=13, textColor=INK, spaceAfter=1,
        ),
        meta=ParagraphStyle(
            "meta", fontName="Times-Italic", fontSize=10,
            leading=12.5, textColor=FAINT, spaceAfter=2,
        ),
        body=ParagraphStyle(
            "body", fontName="Times-Roman", fontSize=10.5,
            leading=14, textColor=INK, alignment=TA_JUSTIFY,
            spaceAfter=4,
        ),
        bullet=ParagraphStyle(
            "bullet", fontName="Times-Roman", fontSize=10.5,
            leading=13.5, textColor=INK, alignment=TA_LEFT,
            leftIndent=0, bulletIndent=0, spaceAfter=1.5,
        ),
        skills=ParagraphStyle(
            "skills", fontName="Times-Roman", fontSize=10.5,
            leading=14, textColor=INK, spaceAfter=1,
        ),
    )


def rule(after=3):
    return HRFlowable(
        width="100%", thickness=0.6, color=RULE,
        spaceBefore=1, spaceAfter=after,
    )


def section(title, styles):
    return KeepTogether([
        Paragraph(title.upper(), styles["section"]),
        rule(),
    ])


def bullets(items, styles):
    paragraphs = [Paragraph(t, styles["bullet"]) for t in items]
    return ListFlowable(
        [ListItem(p, leftIndent=10, value="\u2022") for p in paragraphs],
        bulletType="bullet",
        start="\u2022",
        leftIndent=14,
        bulletFontName="Times-Roman",
        bulletFontSize=10.5,
        bulletColor=INK,
        bulletOffsetY=-1,
    )


def link(text, href):
    return f'<link href="{href}" color="#1f3b73"><u>{text}</u></link>'


# ---- Content ---------------------------------------------------------------
NAME = "MELVIN TABITHA OPONDO"
TAGLINE = "Full-Stack Software Developer"

CONTACT_HTML = (
    "+254 729 563 144 &nbsp;|&nbsp; "
    + link("mtabitha738@gmail.com", "mailto:mtabitha738@gmail.com")
    + " &nbsp;|&nbsp; "
    + link("LinkedIn", "https://www.linkedin.com/in/melvin-tabitha-5abb782a2/")
    + " &nbsp;|&nbsp; "
    + link("GitHub", "https://github.com/MelvinTabitha738")
    + " &nbsp;|&nbsp; "
    + link("Portfolio", "https://melvintabitha.vercel.app/")
    + " &nbsp;|&nbsp; Nairobi, Kenya"
)

SUMMARY = (
    "I am a full-stack Software Developer with hands on experience "
    "building responsive web applications using React.js, Django, and "
    "Flask. I am proficient in designing RESTful APIs, managing relational "
    "and non relational databases, and deploying scalable systems. I work "
    "across the full development lifecycle, from architecture and backend "
    "logic to frontend interfaces and API integration. I am committed to "
    "clean code, continuous learning, and contributing to impactful "
    "real world projects."
)

SKILLS = [
    ("Languages", "Python, JavaScript, SQL, C++, HTML, CSS"),
    ("Frontend", "React.js, React Native, TailwindCSS, Bootstrap, Vite, "
                 "React Hook Form, React Router"),
    ("Backend &amp; Frameworks", "Django, Django REST Framework, Flask, FastAPI"),
    ("Databases", "PostgreSQL, MySQL, MongoDB, SQLite, Redis"),
    ("Tools &amp; DevOps", "Git, GitHub, Docker, Kubernetes (learning), "
                           "Postman, Ngrok, Vercel, Render, Neon, Oracle Cloud, "
                           "Netlify, Firebase"),
    ("APIs &amp; Integrations", "RESTful API development, Safaricom Daraja "
                                "(M-Pesa), Google Maps API, OpenWeather, "
                                "JWT Authentication"),
    ("Testing", "Pytest, Django Test Framework, React Testing Library, Jest"),
    ("Other", "Technical SEO, Canva, Adobe Photoshop"),
]

EXPERIENCE = [
    {
        "org": "Computer Science Academy Africa (CSA)",
        "role": "Web Developer, Website Maintenance &amp; Technical SEO "
                "&nbsp;|&nbsp; "
                + link("csaafrica.org", "https://www.csaafrica.org"),
        "bullets": [
            "I designed, developed, and deployed the live website for "
            "Computer Science Academy Africa, configuring its production "
            "hosting and implementing the technical SEO fundamentals that keep the organisation "
            "discoverable to the students and partners it exists to reach.",
            "I take responsibility for a real external client whose users "
            "depend on the site being up and findable, not a weekend "
            "project. I handle deployment, monitoring, and ongoing content "
            "and performance updates.",
            "I apply technical SEO practices (clean site structure, "
            "crawlable markup, descriptive metadata, performance oriented "
            "page delivery) so the organisation reaches its audience through "
            "organic search rather than paid acquisition alone.",
        ],
    },
    {
        "org": "ACSIS, African Caribbean Sustainability &amp; Investment Summit",
        "role": "Web and Graphic Designer",
        "bullets": [
            "I designed graphics and visual materials that supported the "
            "organisation&rsquo;s communications, branding, and visibility.",
            "I worked collaboratively with a team of designers, coordinating "
            "on shared design work so that each piece aligned with the "
            "organisation&rsquo;s branding requirements.",
            "I contributed to keeping the organisation&rsquo;s materials "
            "visually consistent and to improving the presentation of its "
            "communications.",
        ],
    },
]

# Projects. Flow and voice follow the original CV: name as a bold heading,
# optional links line, then action-verb bullets in first person.
PROJECTS = [
    {
        "name": "Anga: Weather Platform for Kenya",
        "links": [
            ("Live", "https://anga-gules.vercel.app/"),
            ("Code", "https://github.com/MelvinTabitha738/Anga-weather"),
        ],
        "bullets": [
            "As sole developer, I engineered a weather platform for 99 Kenyan "
            "counties and towns around a strict upstream limit of 1,000 API "
            "requests per month, placing a Django REST API between the React "
            "frontend and the Weather AI API so that user requests do not "
            "become upstream calls.",
            "I implemented two-tier Redis caching (30 minute fresh window, "
            "6 hour stale fallback) and request coalescing with atomic Redis "
            "locks, so concurrent cache misses trigger a single upstream "
            "call. Verified on a running server: 30 simultaneous requests "
            "produced exactly 1 upstream request.",
            "I built quota protection for the monthly limit: a circuit "
            "breaker that serves cached data after a 429, a reserve that "
            "halts upstream calls when fewer than 25 requests remain, local "
            "quota tracking synced daily against the provider&rsquo;s usage "
            "endpoint, and per-client throttling.",
            "I served location search from a PostgreSQL gazetteer (47 "
            "counties, 52 towns with aliases), kept the API key server side "
            "behind a CORS allow-list and input validation, and wrote 222 "
            "automated tests (98 backend, 124 frontend), including a "
            "25-thread concurrency test on the coalescing lock.",
            "Stack: Django, Django REST Framework, Redis, PostgreSQL (Neon), "
            "React, Vite; deployed on Vercel and Render.",
        ],
    },
    {
        "name": "StudyBuddy: AI-Powered Study Assistant",
        "links": [
            ("Live", "https://study-buddy-one-lovat.vercel.app/"),
            ("Code", "https://github.com/MelvinTabitha738/study-buddy-ai"),
        ],
        "bullets": [
            "As sole developer, I built an AI study assistant that turns "
            "uploaded notes (PDF, Word, plain text, or lecture recordings) "
            "into summaries, quizzes, and "
            "flashcards grounded strictly in the student&rsquo;s own material.",
            "I implemented a post-generation verification layer: keywords "
            "must appear in the source, definitions and formulae are dropped "
            "below 50% and 60% word overlap, and every quiz question must "
            "quote an evidence sentence from the notes. Gemini runs at low "
            "temperature with structured JSON output.",
            "I designed the AI layer around a free quota of roughly 20 "
            "requests a day: errors classified by type with backoff on "
            "transient failures only, automatic fallback across Gemini "
            "models, and SHA-256 keyed result caching so identical notes "
            "are summarised once.",
            "I built custom JWT authentication with refresh-token rotation "
            "and blacklisting, Argon2 password hashing, constant-time login "
            "to prevent account enumeration, server-side Google token "
            "verification, per-scope rate limits, and file-signature upload "
            "validation, across a REST API of about 31 endpoints.",
            "Stack: Django, Django REST Framework, PostgreSQL (Neon), Gemini "
            "API, React 19, TanStack Start, Tailwind CSS, Cloudinary, Brevo; "
            "deployed on Vercel and Render.",
        ],
    },
    {
        "name": "CallShield: AI-Powered Scam Call Protection System",
        "links": [],
        "bullets": [
            "I built an AI-powered system that detects and flags potential "
            "scam calls in real time as part of a three-person team, with "
            "each member owning a distinct part of the system.",
            "I developed the Kotlin mobile frontend and the Django backend "
            "with RESTful APIs and PostgreSQL, and integrated the scam "
            "detection model into the application so incoming calls are "
            "classified as they arrive.",
            "I worked closely with a teammate who trained the scam detection "
            "model and another who carried out security analysis and "
            "penetration testing, and served as Project Manager, "
            "coordinating planning, tasks, and timelines across the team.",
            "Stack: Kotlin, Django, PostgreSQL.",
        ],
    },
    {
        "name": "SmartHunt: Student House Hunting Platform",
        "links": [],
        "bullets": [
            "I built a student-focused housing platform that connects "
            "tenants with verified rental listings, so students arriving in "
            "a new city can find somewhere safe to live.",
            "I developed the backend using Django and Django REST "
            "Framework, with FastAPI supporting high-performance services, "
            "and designed a MySQL database covering property listings and "
            "users.",
            "I integrated the Google Maps API for location-based property "
            "discovery, so students can filter listings by proximity to "
            "campus rather than scrolling through unrelated options.",
            "I developed the React frontend, delivering a responsive and "
            "intuitive user interface across devices.",
        ],
    },
    {
        "name": "UjamaaFlow: Resource Donation Web App",
        "links": [
            ("Live", "https://ujamaaflow-cock.onrender.com"),
            ("Code", "https://github.com/MelvinTabitha738/UjamaaFlow"),
        ],
        "bullets": [
            "I worked in a team to build a Flask resource donation platform "
            "that connects donors with recipients through a three-role "
            "model (donor, recipient, administrator).",
            "I handled the web design and frontend, building the role-based "
            "dashboards, photo listings, and category and location "
            "filtering with Jinja templates and Bootstrap, while a teammate "
            "built the backend.",
            "Stack: Flask, Flask-SQLAlchemy, Flask-Login, Jinja, SQLite, "
            "Bootstrap; deployed on Render.",
        ],
    },
    {
        "name": "Master Photography Kenya: Studio Website",
        "links": [
            ("Live", "https://master-photography-kenya.vercel.app/"),
            ("Code", "https://github.com/MelvinTabitha738/MasterPhotographyKenya"),
        ],
        "bullets": [
            "I built a ten-page studio website in HTML, CSS, and vanilla "
            "JavaScript that makes no third-party requests, with self-hosted "
            "fonts, a filterable gallery with lightbox, and structured data "
            "(ProfessionalService, FAQ, breadcrumbs) for search.",
            "I wrote a Python static site generator that renders every page "
            "from shared partials, and an audit script that fails the build "
            "on broken internal links, missing alt text or image dimensions, "
            "invalid JSON-LD, malformed HTML, and unverified business claims.",
            "I implemented a WhatsApp enquiry flow with custom validation of "
            "Kenyan phone numbers and a honeypot field against bots, "
            "composing each enquiry as a pre-filled message to the studio.",
            "Stack: HTML, CSS, JavaScript, Python (build and audit tooling), "
            "JSON-LD; deployed on Vercel.",
        ],
    },
    {
        "name": "Developer Portfolio",
        "links": [
            ("Live", "https://melvintabitha.vercel.app/"),
        ],
        "bullets": [
            "I built my portfolio as a static site with no framework or "
            "build step, working identically over HTTP or from the local "
            "file system.",
            "I implemented an interactive terminal (command parsing, "
            "history, tab completion) as a progressive enhancement, light "
            "and dark themes applied before first paint, and accessible "
            "defaults including a skip link, ARIA on interactive controls, "
            "and reduced-motion support.",
            "I added SEO foundations: canonical URLs, a sitemap, structured "
            "data, and Open Graph tags.",
            "Stack: HTML, CSS, JavaScript; deployed on Vercel.",
        ],
    },
    {
        "name": "Weatherfusion: Real-Time Weather Application",
        "links": [
            ("Live", "https://weatherfusion.onrender.com"),
            ("Code", "https://github.com/MelvinTabitha738/Real-Time-Weather-App"),
        ],
        "bullets": [
            "I built a Django weather application that fetches current "
            "conditions and forecasts from the OpenWeatherMap API for any "
            "city, displaying temperature, humidity, and pressure.",
            "I integrated a conversational assistant on Groq&rsquo;s Llama "
            "3.1 model, injecting the live OpenWeatherMap readings for the "
            "requested city into the prompt so answers are based on current "
            "data rather than the model&rsquo;s own knowledge.",
            "Stack: Django, OpenWeatherMap API, Groq (Llama 3.1), HTML, CSS; "
            "deployed on Render.",
        ],
    },
]

EDUCATION = [
    ("Meru University of Science and Technology",
     "Bachelor of Science in Computer Science"),
    ("Computer Science Academy (CSA)", "Software Engineering"),
    ("Power Learn Project (PLP)", "Software Engineering"),
    ("Africa Agility Foundation", "Frontend Web Development"),
    ("Workmates Technology", "UI/UX Design"),
    ("ALX, AI Career Essentials Program",
     "AI tools integration and ethical AI applications in industry workflows"),
    ("Kolanya Girls&rsquo; School", "KCSE &nbsp;|&nbsp; 2019 to 2022"),
]

LEADERSHIP = [
    {
        "role": "Community Outreach Specialist",
        "org": "WISSA, Women in Sustainable STEM Africa",
        "bullets": [
            "I supported outreach programmes aimed at empowering women and "
            "girls in STEM fields across Africa.",
        ],
    },
    {
        "role": "Web &amp; Graphic Designer (Volunteer)",
        "org": "ACSIS, African Caribbean Sustainability &amp; Investment Summit",
        "bullets": [
            "I designed digital graphics and promotional materials using "
            "Adobe Photoshop and Canva.",
            "I worked with other designers to keep event materials "
            "consistent with the organisation&rsquo;s branding.",
        ],
    },
    {
        "role": "Mentor &amp; STEM Advocate",
        "org": "Kolanya Girls&rsquo; Secondary School",
        "bullets": [
            "I mentored students in STEM career pathways, leadership "
            "development, and facilitated coding workshops.",
        ],
    },
    {
        "role": "Social Media Manager",
        "org": "Blockchain Community, Meru University Science Innovators Club",
        "bullets": [
            "I managed and grew the community&rsquo;s social media presence, "
            "creating technical and educational content on blockchain and "
            "emerging technologies.",
            "I supported community engagement, event promotion, and "
            "new member onboarding.",
        ],
    },
]

SOFT_SKILLS = (
    "Leadership &amp; Responsibility &nbsp;&bull;&nbsp; Problem Solving &amp; "
    "Analytical Thinking &nbsp;&bull;&nbsp; Team Collaboration "
    "&nbsp;&bull;&nbsp; Adaptability &amp; Continuous Learning "
    "&nbsp;&bull;&nbsp; Effective Communication"
)

LANGUAGES = (
    "English, Fluent &nbsp;|&nbsp; Kiswahili, Fluent "
    "&nbsp;|&nbsp; French, Intermediate"
)

REFEREES = [
    ("Dr. Sofiat Olausebikan",
     "Founder, Computer Science Academy Africa (CSA)",
     "+44 7584 862761"),
    ("David Robert",
     "Founder, African Caribbean Sustainability &amp; Investment Summit (ACSIS)",
     "+44 7508 142478"),
    ("Shadrack Mwabe", "Security Analyst", "+254 712 533 827"),
]


def project_links_line(p):
    if not p["links"]:
        return None
    return " &nbsp;|&nbsp; ".join(
        link(label, url) for label, url in p["links"]
    )


# ---- CV document -----------------------------------------------------------
def build_cv():
    styles = mk_styles()
    story = []

    # Header
    story.append(Paragraph(NAME, styles["name"]))
    story.append(Paragraph(CONTACT_HTML, styles["contact"]))

    # Summary
    story.append(section("Professional Summary", styles))
    story.append(Paragraph(SUMMARY, styles["body"]))

    # Skills
    story.append(section("Technical Skills", styles))
    for label, items in SKILLS:
        story.append(Paragraph(f"<b>{label}:</b> {items}", styles["skills"]))

    # Experience
    story.append(section("Work Experience", styles))
    for job in EXPERIENCE:
        story.append(Paragraph(job["org"], styles["subhead"]))
        story.append(Paragraph(job["role"], styles["role"]))
        story.append(bullets(job["bullets"], styles))

    # Projects
    story.append(section("Projects", styles))
    for p in PROJECTS:
        story.append(Paragraph(p["name"], styles["subhead"]))
        links_html = project_links_line(p)
        if links_html:
            story.append(Paragraph(links_html, styles["meta"]))
        story.append(bullets(p["bullets"], styles))

    # Education
    story.append(section("Education &amp; Training", styles))
    for school, programme in EDUCATION:
        story.append(Paragraph(f"<b>{school}</b>", styles["skills"]))
        story.append(Paragraph(programme, styles["meta"]))

    # Leadership
    story.append(section("Leadership &amp; Volunteer Experience", styles))
    for role in LEADERSHIP:
        story.append(Paragraph(
            f"<b>{role['role']}.</b> &nbsp;{role['org']}",
            styles["skills"],
        ))
        story.append(bullets(role["bullets"], styles))

    # Soft skills
    story.append(section("Soft Skills", styles))
    story.append(Paragraph(SOFT_SKILLS, styles["skills"]))

    # Languages
    story.append(section("Languages", styles))
    story.append(Paragraph(LANGUAGES, styles["skills"]))

    # Referees
    story.append(section("Referees", styles))
    for name, title, phone in REFEREES:
        story.append(Paragraph(f"<b>{name}</b>", styles["skills"]))
        story.append(Paragraph(title, styles["meta"]))
        story.append(Paragraph(phone, styles["meta"]))
        story.append(Spacer(1, 4))

    doc = SimpleDocTemplate(
        str(CV_PDF), pagesize=A4,
        leftMargin=18*mm, rightMargin=18*mm,
        topMargin=15*mm, bottomMargin=15*mm,
        title="Melvin Tabitha Opondo, CV",
        author="Melvin Tabitha Opondo",
        subject="Full-Stack Software Developer",
    )
    doc.build(story)
    print(f"Wrote {CV_PDF}  ({CV_PDF.stat().st_size} bytes)")


# ---- Resume document (concise, single column, same serif look) -------------
RESUME_FEATURED = [
    "Anga", "StudyBuddy", "CallShield", "SmartHunt", "UjamaaFlow",
    "Master Photography", "Developer Portfolio",
]

def resume_project_bullet(p):
    """One concise line describing a project, suitable for the resume."""
    full = p["name"]
    name = full.split(":")[0].strip()
    short = {
        "Anga": (
            "Django REST and React weather platform for 99 Kenyan locations, "
            "built around a 1,000 request per month API limit: two-tier "
            "Redis caching with stale fallback, request coalescing with "
            "atomic Redis locks (30 concurrent requests, 1 upstream call), "
            "a 429 circuit breaker, a quota reserve, and per-client "
            "throttling. PostgreSQL gazetteer for search, 222 automated "
            "tests. Sole developer."
        ),
        "StudyBuddy": (
            "Django REST and React 19 study assistant that verifies every "
            "AI-generated definition and quiz question against the "
            "student&rsquo;s own notes before display. Gemini model fallback "
            "and SHA-256 result caching on a quota of about 20 requests a "
            "day; custom JWT auth with refresh-token rotation, Argon2 "
            "hashing, and file-signature upload checks. Sole developer."
        ),
        "CallShield": (
            "Real time scam call detection built by a three-person team. I "
            "developed the Kotlin frontend and the Django REST backend with "
            "PostgreSQL and integrated the scam detection model, working "
            "with a teammate who trained the model and another who handled "
            "security analysis and penetration testing. Project Manager."
        ),
        "SmartHunt": (
            "Student housing platform connecting tenants with verified "
            "rental listings. Google Maps powered location search, Django "
            "and FastAPI backend, React frontend."
        ),
        "UjamaaFlow": (
            "Team-built Flask donation platform with three-role accounts "
            "(donor, recipient, administrator). I handled the web design and "
            "frontend (role-based dashboards, photo listings, category and "
            "location filtering) while a teammate built the backend."
        ),
        "Master Photography": (
            "Ten-page studio website in HTML, CSS, and vanilla JavaScript "
            "with no third-party requests, generated by a custom Python "
            "build tool and gated by an audit script that fails on broken "
            "links, missing alt text, or invalid JSON-LD. WhatsApp enquiry "
            "flow with Kenyan phone number validation."
        ),
        "CSA Africa": (
            "Design, development, deployment, hosting configuration, and "
            "technical SEO for the Computer Science Academy Africa website."
        ),
        "Developer Portfolio": (
            "Static site in HTML, CSS, and vanilla JavaScript with no "
            "framework or build step: an interactive terminal, light and "
            "dark themes, accessible defaults, and SEO foundations. "
            "Deployed on Vercel."
        ),
    }
    key = next(k for k in short if k in full)
    body = short[key]
    links_html = ""
    if p["links"]:
        links_html = " &nbsp;(" + " &nbsp;|&nbsp; ".join(
            link(label, url) for label, url in p["links"]
        ) + ")"
    return f"<b>{name}.</b> {body}{links_html}"


def build_resume():
    styles = mk_styles()
    # Slightly tighter sizes on the resume so it stays short
    styles["bullet"] = ParagraphStyle(
        "bullet_r", parent=styles["bullet"],
        fontSize=10, leading=12.8, spaceAfter=1.5,
    )
    styles["skills"] = ParagraphStyle(
        "skills_r", parent=styles["skills"],
        fontSize=10, leading=13.5, spaceAfter=0.5,
    )
    styles["section"] = ParagraphStyle(
        "section_r", parent=styles["section"],
        fontSize=11, spaceBefore=8, spaceAfter=1,
    )
    styles["body"] = ParagraphStyle(
        "body_r", parent=styles["body"],
        fontSize=10, leading=13.5, spaceAfter=3,
    )

    story = []
    story.append(Paragraph(NAME, styles["name"]))
    story.append(Paragraph(TAGLINE, styles["tagline"]))
    story.append(Paragraph(CONTACT_HTML, styles["contact"]))

    short_summary = (
        "I am a full-stack Software Developer with hands on experience "
        "building responsive web applications using React.js, Django, and "
        "Flask. I design RESTful APIs, manage relational and non relational "
        "databases, and deploy scalable systems. I work across the full "
        "development lifecycle, from architecture and backend logic to "
        "frontend interfaces and API integration."
    )
    story.append(section("Professional Summary", styles))
    story.append(Paragraph(short_summary, styles["body"]))

    story.append(section("Technical Skills", styles))
    for label, items in SKILLS:
        story.append(Paragraph(f"<b>{label}:</b> {items}", styles["skills"]))

    story.append(section("Experience", styles))
    for job in EXPERIENCE:
        story.append(Paragraph(job["org"], styles["subhead"]))
        story.append(Paragraph(job["role"], styles["role"]))
        story.append(bullets(job["bullets"], styles))

    story.append(section("Featured Projects", styles))
    featured = []
    for p in PROJECTS:
        if any(k in p["name"] for k in RESUME_FEATURED):
            featured.append(resume_project_bullet(p))
    story.append(bullets(featured, styles))

    story.append(section("Education &amp; Training", styles))
    for school, programme in EDUCATION:
        story.append(Paragraph(
            f"<b>{school}.</b> &nbsp;{programme}",
            styles["skills"],
        ))

    story.append(section("Leadership &amp; Volunteer", styles))
    for role in LEADERSHIP:
        story.append(Paragraph(
            f"<b>{role['role']}.</b> &nbsp;{role['org']}. "
            f"{role['bullets'][0]}",
            styles["skills"],
        ))

    story.append(section("Soft Skills", styles))
    story.append(Paragraph(SOFT_SKILLS, styles["skills"]))

    story.append(section("Languages", styles))
    story.append(Paragraph(LANGUAGES, styles["skills"]))

    doc = SimpleDocTemplate(
        str(RESUME_PDF), pagesize=A4,
        leftMargin=17*mm, rightMargin=17*mm,
        topMargin=14*mm, bottomMargin=14*mm,
        title="Melvin Tabitha Opondo, Resume",
        author="Melvin Tabitha Opondo",
        subject="Full-Stack Software Developer",
    )
    doc.build(story)
    print(f"Wrote {RESUME_PDF}  ({RESUME_PDF.stat().st_size} bytes)")


if __name__ == "__main__":
    build_cv()
    build_resume()
    print("Done.")
