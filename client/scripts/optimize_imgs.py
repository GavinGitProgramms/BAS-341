import os
import sys
from PIL import Image

def optimize_png(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.png'):
                file_path = os.path.join(root, file)
                print(f"Optimizing {file_path}...")
                try:
                    with Image.open(file_path) as img:
                        img.save(file_path, optimize=True)
                except Exception as e:
                    print(f"Error optimizing {file_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python optimize_imgs.py <directory>")
        sys.exit(1)

    directory = sys.argv[1]
    if not os.path.isdir(directory):
        print(f"The directory {directory} does not exist.")
        sys.exit(1)

    optimize_png(directory)
    print("Optimization complete.")