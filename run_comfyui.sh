#!/usr/bin/zsh

# Default values
CUDA_DEVICE="0"
EXPECTED_PYTHON_PATH="/home/jenson/miniforge3/bin/python"
PORT=""

# Function to validate if a string is an integer
is_valid_integer() {
    [[ "$1" =~ ^[0-9]+$ ]]
}

# Parse command-line options
while [[ $# -gt 0 ]]; do
    case "$1" in
        --port)
            if is_valid_integer "$2"; then
                PORT="$2"
                shift 2
            else
                echo "Error: Invalid port number specified."
                exit 1
            fi
            ;;
        *)
            echo "Invalid option: $1"
            exit 1
            ;;
    esac
done

source /home/jenson/miniforge3/bin/activate

# Check python path
current_python_path=$(which python)
if [ "$current_python_path" != "$EXPECTED_PYTHON_PATH" ]; then
    echo "Error: Unexpected python path. Aborting."
    exit 1
fi

# Set proxy
export http_proxy="http://host.docker.internal:9910" https_proxy="http://host.docker.internal:9910" HTTP_PROXY="http://host.docker.internal:9910" HTTPS_PROXY="http://host.docker.internal:9910"
echo "Using proxy ${http_proxy}"

# Set TensorRT
export LD_LIBRARY_PATH="/home/jenson/miniforge3/lib/python3.10/site-packages/tensorrt_libs:$LD_LIBRARY_PATH"

python main.py --listen --port $PORT --cuda-device "$CUDA_DEVICE"
