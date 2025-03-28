// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::Manager;
// use tauri_plugin_fs::FsPlugin;

fn main() {
    tauri::Builder::default()
        // .plugin(FsPlugin::new())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}