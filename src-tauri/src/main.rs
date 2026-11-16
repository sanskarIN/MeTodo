#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Bundle only static UI. Never expose native shell or filesystem commands.
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("unable to start MeTodo desktop");
}
