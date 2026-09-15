# LOHR-BENCH website

Anonymous project website for LOHR-BENCH, with task demonstrations, method rankings, and the supplementary appendix.

## Pages

- `index.html`: overview, abstract, and 20 task videos.
- `leaderboard.html`: TAMP, end-to-end, and hybrid method rankings.
- `static/pdf/LoHR_Supplementary.pdf`: supplementary appendix.

Rankings use each method's mean success rate and mean progress across all its reported tasks. The per-task data and ranking summaries are available under `static/data/`.

## Preview locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000.

## Publish with GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/ (root)**, then save. GitHub Pages will publish updates pushed to `main`.

Expected site address: https://icra27.github.io/LoHRBench.io/

The `.nojekyll` file lets GitHub Pages serve this static site directly. Paper and Dataset links remain placeholders until their URLs are available.

## Attribution

Website adapted from [Nerfies](https://nerfies.github.io/), under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
