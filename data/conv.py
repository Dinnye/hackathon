import aspose.cad as cad
from aspose.imaging.imageoptions import BmpOptions, JpegOptions, PngOptions, TiffOptions

image = cad.Image.load("floor-490650.glb")

cadRasterizationOptions = cad.imageoptions.CadRasterizationOptions()
cadRasterizationOptions.page_height = 800.5
cadRasterizationOptions.page_width = 800.5
cadRasterizationOptions.zoom = 1.5
cadRasterizationOptions.layers = "Layer"
#cadRasterizationOptions.background_color = Color.green

options = JpegOptions()
options.vector_rasterization_options = cadRasterizationOptions

image.save("result.jpeg", options)