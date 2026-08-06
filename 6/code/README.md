# Project 5 Code

These notebooks accompany **CS180/280A Project 5: Fun With Diffusion Models**.
The rendered experiments and discussion remain available on the
[Project 5 webpage](../index.html).

## Notebooks

- [`project5a_diffusion.ipynb`](project5a_diffusion.ipynb) — sampling with
  DeepFloyd IF, iterative denoising, classifier-free guidance, SDEdit,
  inpainting, visual anagrams, and hybrid images.
- [`project5b_flow_matching.ipynb`](project5b_flow_matching.ipynb) — a U-Net
  implementation and unconditional, time-conditioned, and class-conditioned
  flow matching on MNIST.

## Environment

The notebooks were developed for a CUDA-enabled Google Colab environment.
Install the Python dependencies with:

```bash
python -m pip install -r requirements.txt
```

Part A additionally requires access to the gated
[`DeepFloyd/IF-I-L-v1.0`](https://huggingface.co/DeepFloyd/IF-I-L-v1.0) and
[`DeepFloyd/IF-II-L-v1.0`](https://huggingface.co/DeepFloyd/IF-II-L-v1.0)
model repositories, the course-provided prompt embeddings, and the input
images referenced by the notebook. Part B downloads MNIST through
`torchvision` when it first runs. Model weights and datasets are intentionally
not stored in this repository.

## Attribution

Completed for UC Berkeley CS180/280A, *Introduction to Computer Vision and
Computational Photography*, Fall 2025. The project specification and starter
materials were provided by the CS180/280A course staff. See the
[course Project 5 specification](https://cal-cs180.github.io/fa25/hw/proj5/)
for the original assignment.
