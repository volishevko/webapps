## Instructions for segmenting brain tissue WSIs

### Introduction
Welcome to the brain tissue segmentation interface. When you load a whole slide image (WSI) via this web app,
you will see a view like the image below. The tissue image in a zoomable WSI viewer is below, and annotation
controls are found in the toolbar at the top of the window.

![Intro 1](./resources/intro1.png)

Let's take a closer look at the toolbar. The buttons in the top row activate different tissue regions that
should be annotated.

![Intro 3](./resources/intro3.png)

Specific annotation tools are found in the toolbar below the "Activate" buttons. Most of these tools are
disabled until an annotation region is activated. We will see what the active buttons look like a bit later.

![Intro 4](./resources/intro4.png)

To the right of the annotation toolbar are sliders that control the opacity of the annotations. Right now,
since we haven't drawn anything, this won't do much.

![Intro 5](./resources/intro5.png)

When we activate a region, the button turns blue to indicate what annotation we are working on, and the
toolbar becomes activated. The "trim" buttons become active too - more on this below.

![Intro 6](./resources/intro6.png)

We have selected "White Matter" as the first region to annotate. Let's get started!

### Drawing with Polygon Tool: White Matter

Now that the toolbar is activated, we can select a tool to use. Here, we are activating the **polygon tool**.
With the tool active, we can **click and drag** on the WSI to start or add to the active annotation.

![White Matter 1](./resources/whitematter1.png)

Let's keep going. In addition to click-and-drag, we can also **click to add individual points** to the annotation.
Below, we are adding more points one by one to define the boundaries of the white matter. Clicking on the first
point of the polygon will finish the area, and the inside of the polygon will become colored in. You can also 
**double-click** to add a point and close the polygon automatically.

![White Matter 1](./resources/whitematter2.png)

Hooray! We have finished the first part of our tissue segmentation. Next, we will use a different tool to annotate
the next region.

### Drawing with Brush Tool: Leptomeninges

We have now zoomed in on a region of leptomeningeal blood vessels that we wish to annotate, and have activated
the **brush tool**. This tool will fill in the whole region that the brush passes over. The radius of the brush
can be controlled with the **scroll wheel** of the mouse, **scrolling on a trackpad**, or with the slider
in the toolbar.

![Leptomeninges 1](./resources/lepto1.png)

Click and drag to move the brush over the image. When you release the click, the area you have drawn will become
a polygon with the outline selected.

![Leptomeninges 2](./resources/lepto2.png)

To continue, just click and drag again - the new area will be added to the old one. The green color of the brush
indicates that we are in "add mode."

![Leptomeninges 3](./resources/lepto3.png)

Oops! We accidentally included some extra area that we don't want to be part of the leptomeninges. We can click
the **Eraser** button to fix this. The cursor will turn red to indicate that you are now erasing, instead of adding
area to the annotation like we did above. There is a **hotkey: e** that will toggle erase mode.

![Leptomeninges 4](./resources/lepto4.png)

Draw over the area you wish to remove from the annotation, and when you release the mouse, the annotation will be updated
to reflect this.

![Leptomeninges 5](./resources/lepto5.png)
![Leptomeninges 6](./resources/lepto6.png)

Great! Our leptomeninges are now complete.

### Magic Wand Tool: Background

To quickly select all of the background (the glass of the microscope slide with no tissue on it), we will use the
**Magic Wand Tool**. Activate the wand tool, and click on the background area. The selection is based on the **pixel color**
relative to the pixel that was originally clicked. To help you pick the right pixel to start with, the cursor is replaced
by a super zoomed-in view to show pixel colors in a magnified way. For picking the background color, this shouldn't matter too much.

When you select a region via the wand tool, your selection will be displayed interactively by pulsing in the opposite color of the
average pixel within the selection. For our light-colored background area, this means it will turn dark, and will pulse on and
off to show exactly what you've selected.

![Background 1](./resources/background1.png)

 When you like the selection, click "Apply" to convert the preview into a polygon. If you don't want to continue with the tool,
 click "Done" to close out of this interface and stop the selection from pulsing.

![Background 2](./resources/background2.png)

#### Magic Wand: More Info

How sensitive the wand is makes a big difference in the area you select from any given starting point. This sensitivity
can be adjusted in two ways: by **click-and-drag up and down** or by **using the slider in the toolbar**. Below, we're
selecting the tissue using a lower threshold which only captures some of it, then adjusting the threshold to include the
whole tissue region. This is just a demonstration; we'll come back to getting this part of the tissue into our annotations
later.

![Wand 1](./resources/wand1.png)
![Wand 2](./resources/wand2.png)

### Using Trim Selected: Superficial Cortex

Next we will annotation the superficial layer (molecular layer) of the gray matter, where there aren't many nuclei and essentially no neurons.
This region appears a bit lighter in color on H&E stained sections. We will use the brush tool to paint over this area.
**Special note:** Since we have already used the wand tool to define the "background" area, we don't need to worry about
being super precise - we can let our brush drawing overlap with this area. We will use the "trim" buttons to clean this
up in just a minute.

![Superficial 1](./resources/superficial1.png)

Zooming in, we can see that our annotation captures the superficial layer of cortex, but also includes some white space outside of the tissue.

![Superficial 2](./resources/superficial2.png)

No problem! We will use the **Trim Selected** button. This button modifies the currently selected annotation
by **removing overlap with other annotations**.

![Superficial 3](./resources/superficial3.png)

Great! Now our superficial cortex annotation just captures the actual superficial cortex.

### Combination of Tools: Gray Matter

Let's get to the gray matter now. We will use a combination of tools here: First the wand tool, then trim button,
and finally the brush tool to clean up.

![Gray Matter 1](./resources/graymatter1.png)

Like we did above, we've used the wand tool to select most of the tissue, including all of the area we want.
More than just gray matter is currently selected - there is overlap with both the white matter and the superficial
cortex. No matter, though - we can use the trim button to get rid of the overlap.

![Gray Matter 2](./resources/graymatter2.png)

**Trim Selected** got rid of all the areas that overlapped with our other annotation. However, there is a bit left
around the edges, which you can see as the green line surrounding the bottom part of the tissue (the edge of the
white matter).


Using the **Brush Tool** in erase mode, we can easily clean that up:

![Gray Matter 3](./resources/graymatter3.png)
![Gray Matter 4](./resources/graymatter4.png)

### Using Trim Others: Exclude

Ok! We have annotated all of the tissue types we care about. However, there is a tear in the tissue that
we should mark as an artifact to exclude from further analysis. To do this, we will use the "Exclude"
region, and pick the best tool for the job. Here, we are using the **Polygon Tool** to outline the area to
exclude.

![Exclude 1](./resources/exclude1.png)

We have drawn our region, but it overlaps with the others that we already created. No problem, we have the
**Trim Tools**!

However, we need to do this a bit differently than we have so far. Previously, we used the **Trim Selected**
button to remove area from our selected region. This is *not* what we want this time, though. Instead, we
will use **Trim Others** in order to remove our current selection from the other annotations:

![Exclude 2](./resources/exclude2.png)

Et Voila!

### Final Steps

To view our annotations more clearly, let's use the opacity slider to make the colors more
opaque/intense:

![Opacity 1](./resources/opacity1.png)

Looking good! Let's mark this as completed using the checkbox to let everyone know we're done with this image.
(Note: you can also save without marking the annotation as complete, so you can come back to it later.)

![Finished 1](./resources/finished1.png)

And let's hit that **Save Button** to save our changes back to the database! A confirmation message will pop
up letting you know that the save was successful, or that something went wrong,
 like a disconnected network connection or something.

![Save 1](./resources/save1.png)

Congratulations, we've completed a tissue annotation!