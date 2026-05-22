with open("test_import_result.txt", "w") as f:
    try:
        import google.generativeai as genai
        f.write("Import successful")
    except Exception as e:
        f.write(f"Import failed: {e}")
