import streamlit as st
import json
from ai_engine import generate_learning_path, generate_weekly_quiz

# --- PAGE CONFIG ---
st.set_page_config(page_title="AI Learning Navigator", page_icon="🎓", layout="wide")

# --- MODERN CSS STYLING ---
st.markdown("""
    <style>
    .stApp { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
    [data-testid="stSidebar"] { background-color: #0f172a !important; }
    [data-testid="stSidebar"] * { color: #f1f5f9 !important; }

    /* FIX: Dark font for input boxes */
    div[data-baseweb="input"] input {
        color: #1e293b !important; 
        -webkit-text-fill-color: #1e293b !important;
    }
    /* div[data-baseweb="select"] > div {
        color: #1e293b !important;
    } */
    /* FIX: Skill level dropdown text color */
div[data-baseweb="select"] div {
    color: #1e293b !important;
    -webkit-text-fill-color: #1e293b !important;
}

/* Selected value box */
[data-testid="stSidebar"] div[data-baseweb="select"] > div {
    background-color: white !important;
    color: #1e293b !important;
}

/* Dropdown options */
div[role="listbox"] div {
    color: #1e293b !important;
    background-color: white !important;
}
    div[role="listbox"] div{
    color: #1e293b !important
    }
    .resource-card {
        background: white;
        padding: 15px;
        border-radius: 12px;
        border-left: 5px solid #6366f1;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        margin-bottom: 10px;
    }

    .stButton>button {
        background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        border-radius: 10px;
        font-weight: 600;
    }
    </style>
    """, unsafe_allow_html=True)

# --- HELPER FUNCTIONS ---
def load_all_resources():
    try:
        with open("resources_db.json", "r") as f:
            return json.load(f)
    except:
        return []

def get_filtered_resources(topic_name, user_level):
    all_res = load_all_resources()
    ai_topic = topic_name.lower().strip()
    return [r for r in all_res if r['level'] == user_level and r['topic'].lower() in ai_topic]

# --- APP LAYOUT ---
main_tab, library_tab = st.tabs(["🚀 My Learning Journey", "📚 Global Resource Library"])

with main_tab:
    with st.sidebar:
        st.header("⚙️ HelloCareer")
        goal = st.text_input("What do you want to learn?", placeholder="e.g. Data Science")
        level = st.selectbox("Your Skill Level", ["Beginner", "Intermediate", "Advanced"])
        
        if st.button("Generate Roadmap"):
            if goal:
                with st.spinner("🧠 AI is drafting your curriculum..."):
                    st.session_state.roadmap = generate_learning_path(goal, level)
                    st.session_state.user_level = level
                    st.session_state.goal = goal
            else:
                st.error("Please enter a goal!")

    if "roadmap" in st.session_state:
        done_count = sum(1 for i in range(6) if st.session_state.get(f"done_{i}"))
        col_m1, col_m2 = st.columns([0.7, 0.3])
        with col_m1:
            st.progress(done_count / 6, text=f"Overall Progress: {int((done_count/6)*100)}%")
        with col_m2:
            st.metric("Weeks Completed", f"{done_count}/6")

        st.divider()

        week_tabs = st.tabs([f"Week {i+1}" for i in range(6)] + ["🏁 Final Projects"])

        for i, week in enumerate(st.session_state.roadmap['weeks']):
            with week_tabs[i]:
                c1, c2 = st.columns([0.8, 0.2])
                with c1:
                    st.header(f"Week {i+1}: {week['topic']}")
                    st.write(week['description'])
                with c2:
                    # BALLOONS REMOVED FROM HERE
                    st.checkbox("Mark as Done", key=f"done_{i}")

                res = get_filtered_resources(week['topic'], st.session_state.user_level)
                if res:
                    st.subheader("📚 Recommended Materials")
                    r_cols = st.columns(len(res) if len(res) < 3 else 3)
                    for idx, r in enumerate(res):
                        with r_cols[idx % 3]:
                            st.markdown(f"""
                                <div class="resource-card">
                                    <small style="color:#6366f1;">{r['platform']}</small>
                                    <p style="font-weight:bold; margin:0; color:#1e293b;">{r['title']}</p>
                                    <a href="{r['link']}" target="_blank" style="font-size:0.8em; color:#4f46e5;">Open Link →</a>
                                </div>
                            """, unsafe_allow_html=True)

                st.divider()
                st.subheader("📝 Weekly Knowledge Check")
                if st.button(f"Generate Quiz {i+1}", key=f"q_{i}"):
                    with st.spinner("AI is crafting questions..."):
                        st.session_state[f"quiz_data_{i}"] = generate_weekly_quiz(week['topic'], st.session_state.user_level)['quiz']
                
                if f"quiz_data_{i}" in st.session_state:
                    with st.form(f"form_{i}"):
                        score = 0
                        for idx, q in enumerate(st.session_state[f"quiz_data_{i}"]):
                            choice = st.radio(f"**Q{idx+1}:** {q['q']}", q['options'], key=f"ans_{i}_{idx}")
                            if choice.strip().lower() == q['correct'].strip().lower():
                                score += 1
                        if st.form_submit_button("Submit Answers"):
                            if score >= 7:
                                st.success(f"Excellent! Score: {score}/10")
                                # NOTE: Snow effect remains for the quiz pass! Remove if needed.
                                st.snow()
                            else:
                                st.warning(f"Score: {score}/10. Keep learning!")

        with week_tabs[6]:
            st.header("🏆 Recommended Capstone Projects")
            for p in st.session_state.roadmap['projects']:
                with st.expander(f"📌 {p['name']}"):
                    st.write(p['desc'])
    else:
        st.info("👋 Welcome! Set your goal in the sidebar to generate a personalized roadmap.")

# --- LIBRARY TAB ---
with library_tab:
    st.header("📖 Full Resource Catalog")
    all_data = load_all_resources()
    search = st.text_input("🔍 Search Library", placeholder="e.g. Python, Security...")
    
    col_a, col_b, col_c = st.columns(3)
    for idx, r in enumerate(all_data):
        if search.lower() in r['topic'].lower() or search.lower() in r['title'].lower():
            target_col = [col_a, col_b, col_c][idx % 3]
            with target_col:
                with st.container(border=True):
                    st.caption(f"{r['topic']} | {r['level']}")
                    st.write(f"**{r['title']}**")
                    st.link_button("View Course", r['link'], use_container_width=True)