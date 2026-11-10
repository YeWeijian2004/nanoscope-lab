# NanoScope Lab — An Interactive Microscopy Teaching Website

An English educational platform connecting optical, electron and scanning probe microscopy with contemporary Research Frontiers. Students manipulate teaching models, interpret signals and compare them with clearly labelled real images.

## Optical Microscopy

`optical.html`, `optical.css`, `optical.js` cover optical foundations and an explicitly simplified confocal sectioning model. `optical-embed.css` provides an opt-in view of the existing background resolution experiment; its numerical code is unchanged. Attributed equipment and fluorescence images are stored locally; all simulations and diagrams run locally.

## Learning journey

`index.html` presents three main photographic learning paths: Optical Microscopy (`optical.html`), Electron Microscopy (`electron.html`), Scanning Probe Microscopy (`spm.html`) plus a highlighted Super-resolution labs area and a separate Research Frontiers area. Optical includes resolution, fluorescence, confocal, SIM, STED and STORM. Electron covers SEM/TEM, sources, lenses, aberrations and signals. Scanning Probe covers piezo scanning, STM feedback, AFM forces and advanced probes. Direct links to all six super-resolution/frontier labs and the original optional 3D background workbench are retained.

| Module | Page | Teaching model |
| --- | --- | --- |
| SIM | `sim.html` | Two directions × three phases; measured-frame linear inverse reconstruction of fixed stripe regions. |
| STED | `sted.html` | Ideal depletion-dependent Gaussian PSF narrowing and a scanned emitter pair. |
| STORM | `storm.html` | Sparse stochastic emission, photon noise, centroid localization and accumulated estimates. |
| 4Pi-SIMFLUX | `frontiers.html` | Noisy phase-dependent photon channels, numerical position estimation and lateral/axial uncertainty comparisons. |
| LA-SIM | `la-sim.html` | Depth-dependent illumination and acquired section stacks; a separate conceptual flow explains activation, patterned readout and computation. |
| Electrochemical Multicolour STED | `ec-sted.html` | Illustrative potential responses, noisy mixtures, rank/conditioning checks and non-negative numerical unmixing. |

Each lab links Home and related techniques. Supplementary Field Guide links open in a new tab, leaving the original workbench and its state open. Presentation files are not included in the public distribution. Explanations and assumptions appear below the experiments. Keyboard-accessible controls and responsive layouts are provided.

## Scientific scope

All simulation sample data are synthetic. The homepage also includes explicitly labelled experimental micrographs and equipment photographs. The simulations are transparent educational models, not validated quantitative instrument simulations. SIM uses an ideal noiseless forward model; STED uses a width-scaling proxy rather than full photophysics; STORM uses simplified independent blinking and centroid fitting. Research labs illustrate selected principles, not the papers' complete processing pipelines.

Optical sectioning alone does not overcome diffraction. Localization precision is not spatial resolution. Electrochemical modulation separates labels but does not improve STED's intrinsic resolution. Published results are explicitly distinguished from simulator outputs: in particular, the 4Pi-SIMFLUX paper's 2–3 nm precision is not guaranteed here. LA-SIM's conceptual diagram produces no reconstructed measurement data. Each page explains further limitations and its challenge criteria.

### Research sources

- Wang et al., *4Pi-SIMFLUX: 4Pi single-molecule localization microscopy with structured illumination*. Nature Methods 23, 175–182 (2026); online 20 November 2025. [DOI: 10.1038/s41592-025-02908-8](https://doi.org/10.1038/s41592-025-02908-8).
- Dong et al., *Lattice light sheet activation structured illumination super-resolution microscopy*. Nature Photonics (2026); published 28 September 2026. [DOI: 10.1038/s41566-026-02019-6](https://doi.org/10.1038/s41566-026-02019-6).
- Yang et al., *Electrochemical fluorescence modulation enables simultaneous multicolour imaging*. Nature Photonics (2025). [DOI: 10.1038/s41566-025-01672-7](https://doi.org/10.1038/s41566-025-01672-7).

Classical labs cite relevant course lectures; SIM also links Gustafsson (2000). No lecture PDFs or experimental research datasets are redistributed.

## Files

- `index.html`, `home.css`: three-path photographic homepage with separate super-resolution and research areas; `navigation.css`: shared lab navigation.
- `assets/images/`: locally stored photographs/micrographs and `CREDITS.md` with original titles, authors, source/download URLs, licences and modification records. Keep this folder when deploying.
- `optical.*`, `electron.*`, `spm.*`: focused teaching pages and their existing interactions; corresponding embed/core files support these lessons.
- `sim.*`, `sted.*`, `storm.*`: classical pages, styles and interactions; corresponding `*-core.js` files contain numerical models. `sim-theory.js` handles the SIM optical diagram.
- `frontiers.*`, `la-sim.*`, `ec-sted.*` and their `*-core.js` files: independent research teaching modules. Labs reuse `sim.css` and, where linked, `sted.css`; keep shared styles when deploying.
- `background.html`, `studio.css`, `studio.js`: preserved Optical, SEM, AFM and STM 3D playground.
- `theory.html`: concise super-resolution Field Guide. `science-nav.js`: safe lab-return links and direct-entry navigation. `background-guide.html`, `style.css`, `app.js`: preserved general microscopy science, additional experiments, quizzes and notes.
- `icon.svg`, `.nojekyll`: local icon and static-hosting marker.

## Local preview

From this folder run `python -m http.server 8000`, then open `http://localhost:8000/`. Python is only an optional preview server, not a deployed dependency. Use a modern browser with JavaScript, SVG and Canvas 2D support. WebGL is needed only for the optional 3D background playground. External paper links require internet access; the labs have no CDN, package installation, API key or backend requirement.

## Deploy to GitHub Pages

1. Upload the **contents of this folder** to the publishing repository root, preserving filenames and the empty `.nojekyll` file. Do not upload the enclosing workspace or a ZIP as the website.
2. Commit to `main`. In repository Settings → Pages, select **Deploy from a branch**, `main`, **/ (root)**. Alternatively, put the complete site in `/docs` and select that publishing folder.
3. Open the URL GitHub reports after deployment. No build command or dependency installation is needed. Public repositories support Pages on GitHub Free; other visibility options depend on the account plan.
4. Check the four category paths and all six laboratory links, Home links, paper links and one acquisition/reset per lab on the live URL. Check a narrow mobile viewport as well.

Bundled assets and internal navigation use relative paths, supporting `https://USERNAME.github.io/REPOSITORY/`. The entry file must be `index.html` at the publishing source root. See [GitHub's official deployment guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). This local project has not yet been verified on a live GitHub Pages deployment.

## Privacy and provenance

No analytics, remote fonts, third-party scripts or server storage. Optional background notes and discovery progress use browser local storage when available. Simulation state is local to the browser; research links navigate to external publishers. All diagrams are schematic; each model states its educational scope.

## Electron microscopy learning path

`electron.html`, `electron.css`, `electron.js` and `electron-core.js` provide source/lens/signal explanations, an illustrative TEM mass-thickness model and the lecture-convention beam-spot demonstration. `electron-embed.css/js` select the existing electron workbench via its normal tab control without changing `app.js`. Access the lesson from Home or Background. Local SEM/TEM micrographs and an instrument photo carry source and rights credits on the page. No dependencies or build step are added.

## Scanning probe learning path

`spm.html`, `spm.css`, `spm.js` and `spm-core.js` reuse the learning-page styles and link to the original 3D STM/AFM and tip-broadening experiments. New demonstrations cover finite-settling STM scanning modes and an illustrative AFM force curve with explicitly prescribed dynamic motion. They are not quantitative instrument simulations. The STM current helper matches the preserved `studio.js` model. All credited images are stored locally; external source links require internet access. No dependencies or build step are added.

## Local image credits

Fourteen verified images are stored locally across the teaching pages. No new libraries or build step are required. Full provenance and modification notes: [assets/images/CREDITS.md](assets/images/CREDITS.md).

| Image | Author | Rights |
| --- | --- | --- |
| A Binocular Microscope | Suneksiriaaron | CC0 1.0 |
| Transmission electron microscope (2) | Gannu03 | CC BY-SA 4.0 |
| AFM at work | AAMonitor96 | CC BY-SA 3.0 |
| 0300 Flourescence Stained new | OpenStax; Mortadelo2005 micrograph credit | CC BY 4.0 |
| Misc pollen | Dartmouth College Electron Microscope Facility | Author-released public domain |
| Mitochondria - TEM | Louisa Howard | Author-released public domain |

Retain attribution and licence notices; adapted ShareAlike images retain their original licences. Equipment photographs do not represent specimen measurements. The fluorescence poster is contextual, not a published frontier result; the SEM image is grayscale and its exact detector channel is unspecified. Specific frontier-instrument photos are not included. Open-licensed SIM and MINFLUX figures are credited individually. Optical and Electron pages reuse local images. `imaging-visuals.css/js` provide responsive image-reading sections and keyboard-accessible component explanations without accessing simulation state. Numerical models and controls remain unchanged.


## Learning paths and compact frontiers

`learning-paths.css` is a shared, scoped editorial layer for paired real-image covers, knowledge maps and research summaries. It does not change simulation control styles or numerical scripts. Laboratory URLs open their operational workbenches directly. Poster links use `#workbench`; no scientific action runs automatically. Optional Optical/SEM/AFM/STM instrument dialogs reuse the original Background 3D viewer and keep both workspaces mounted when closed.

`research.html` is the lightweight research overview. It connects the three existing research labs and adds conceptual MINFLUX and Cryo-EM lessons with published imagery, innovations, takeaways and limitations. These two lessons have no new simulation or reconstruction algorithm. `background.html` and `background-guide.html` remain internal reusable implementations. Public learning paths embed their existing activities; old direct URLs route to the corresponding learning sections. `learning-extras.js/css` selects and presents these activities without changing their calculations or quiz scoring.

Additional image credits: MINFLUX Figure 1 (Schmidt et al., 2021), CC BY 4.0; cryo-EM lysate (Pkastrit), CC BY-SA 4.0; Stefan W. Hell portrait (Bernd Schuller), CC BY-SA 3.0. Full original titles, URLs and modification records are in `assets/images/CREDITS.md`. Generic instrument photographs are never labelled as photographs of specialized super-resolution systems.

Deploy the entire directory, including `research.html`, `learning-paths.css` and `assets/images/`. All internal paths are relative; no package installation, build step, server API or new dependency is required.

`poster-covers.css` supplies the shared result-first editorial covers on the homepage and category pages. Original inline SVG insets are conceptual diagrams, not experimental data. Cropped cover views link to complete local images; see the modification records in `assets/images/CREDITS.md`. Include this stylesheet when deploying. The four obsolete entry handlers have been removed; numerical models and experiment handlers are unchanged. `science-nav.js` manages optional instrument dialogs and Field Guide return links.

## Consolidated activities and attribution

Optical contains the shared instrument-selection guide, six-question concept check and lab notebook (`#concept-check`). Electron contains the existing ptychography geometry and 2021/2026 research discussion (`#ptychography`). Scanning Probe contains finite-tip AFM and tunnelling sensitivity (`#tip-models`). Original 3D models remain available in View Instrument panels. Keep both legacy HTML files and all their scripts when deploying. The footer links to `image-credits.html`, a readable rendering of the full provenance record.
