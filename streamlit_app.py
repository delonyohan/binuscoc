import streamlit as st

st.set_page_config(layout="wide")

st.title("binuscoc Web Application")

st.write("Welcome to the binuscoc web application. This is a placeholder for your web content.")

st.sidebar.header("Navigation")
st.sidebar.radio(
    "Go to",
    ("Dashboard", "Live Monitor", "Model Manager", "Metrics", "License & Info")
)

# You can add more Streamlit components here to re-create your web pages.
# For example:
# if st.sidebar.radio("Go to") == "Dashboard":
#     st.header("Dashboard")
#     st.write("This is your dashboard content.")
# elif st.sidebar.radio("Go to") == "Live Monitor":
#     st.header("Live Monitor")
#     st.write("This is your live monitor content.")
