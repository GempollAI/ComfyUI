#!/usr/bin/zsh

# Default values
CUDA_DEVICE=""
EXPECTED_PYTHON_PATH="/home/ai/mambaforge/envs/aigc/bin/python"

# Parse command-line options
while [[ $# -gt 0 ]]; do
    case "$1" in
        --gpu)
            CUDA_DEVICE="$2"
            shift 2
            ;;
        *)
            echo "Invalid option: $1"
            exit 1
            ;;
    esac
done

# Check if required options are provided
if [ -z "$CUDA_DEVICE" ] ; then
    echo "Error: Required options --gpu are missing."
    exit 1
fi


source /home/ai/mambaforge/bin/activate aigc

# Check python path
current_python_path=$(which python)
if [ "$current_python_path" != "$EXPECTED_PYTHON_PATH" ]; then
    echo "Error: Unexpected python path. Aborting."
    exit 1
fi

# Set proxy
export http_proxy="http://localhost:9910" https_proxy="http://localhost:9910" HTTP_PROXY="http://localhost:9910" HTTPS_PROXY="http://localhost:9910"
echo "Using proxy ${http_proxy}"

# Set TensorRT
export LD_LIBRARY_PATH="/home/ai/mambaforge/envs/aigc/lib/python3.10/site-packages/tensorrt_libs:$LD_LIBRARY_PATH"

python main.py --listen --port 8188 --cuda-device "$CUDA_DEVICE"