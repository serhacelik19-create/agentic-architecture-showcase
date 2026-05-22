import AppKit
import Foundation

struct Slide: Decodable {
    let id: String
    let title: String
    let subtitle: String
    let badge: String
    let input: String
    let output: String
    let accent: String
}

let fileManager = FileManager.default
let baseURL = URL(fileURLWithPath: fileManager.currentDirectoryPath)
    .appendingPathComponent("marketing/app_store", isDirectory: true)
let inputURL = baseURL.appendingPathComponent("input", isDirectory: true)
let outputURL = baseURL.appendingPathComponent("output", isDirectory: true)
let slidesURL = baseURL.appendingPathComponent("slides.json")
let logoURL = baseURL.appendingPathComponent("../../assets/images/logo.png").standardizedFileURL

struct RenderConfig {
    let suffix: String
    let canvasSize: NSSize
}

let referenceCanvas = NSSize(width: 1242, height: 2688)
let renderConfigs = [
    RenderConfig(suffix: "", canvasSize: NSSize(width: 1242, height: 2688)),
    RenderConfig(suffix: "-ipad", canvasSize: NSSize(width: 2064, height: 2752)),
]

func color(hex: String, alpha: CGFloat = 1) -> NSColor {
    let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var int: UInt64 = 0
    Scanner(string: cleaned).scanHexInt64(&int)
    let r, g, b: UInt64
    switch cleaned.count {
    case 6:
        (r, g, b) = ((int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff)
    default:
        return NSColor(calibratedWhite: 0.5, alpha: alpha)
    }
    return NSColor(
        calibratedRed: CGFloat(r) / 255,
        green: CGFloat(g) / 255,
        blue: CGFloat(b) / 255,
        alpha: alpha
    )
}

func makeFont(_ name: String, size: CGFloat, weight: NSFont.Weight = .regular) -> NSFont {
    NSFont(name: name, size: size) ?? NSFont.systemFont(ofSize: size, weight: weight)
}

func roundedRectPath(_ rect: NSRect, radius: CGFloat) -> NSBezierPath {
    NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
}

func drawRoundedRect(_ rect: NSRect, radius: CGFloat, fill: NSColor, shadow: NSShadow? = nil, stroke: NSColor? = nil, lineWidth: CGFloat = 1) {
    NSGraphicsContext.saveGraphicsState()
    shadow?.set()
    fill.setFill()
    let path = roundedRectPath(rect, radius: radius)
    path.fill()
    if let stroke {
        stroke.setStroke()
        path.lineWidth = lineWidth
        path.stroke()
    }
    NSGraphicsContext.restoreGraphicsState()
}

func aspectFillRect(imageSize: NSSize, inside frame: NSRect) -> NSRect {
    let widthRatio = frame.width / imageSize.width
    let heightRatio = frame.height / imageSize.height
    let scale = max(widthRatio, heightRatio)
    let width = imageSize.width * scale
    let height = imageSize.height * scale
    let x = frame.minX + (frame.width - width) / 2
    let y = frame.minY + (frame.height - height) / 2
    return NSRect(x: x, y: y, width: width, height: height)
}

func drawText(_ text: String, rect: NSRect, font: NSFont, color: NSColor, alignment: NSTextAlignment = .left, lineSpacing: CGFloat = 0) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = alignment
    paragraph.lineBreakMode = .byWordWrapping
    paragraph.lineSpacing = lineSpacing
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: color,
        .paragraphStyle: paragraph
    ]
    let attributed = NSAttributedString(string: text, attributes: attrs)
    attributed.draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading])
}

func savePNG(_ image: NSImage, to url: URL) throws {
    guard
        let tiff = image.tiffRepresentation,
        let bitmap = NSBitmapImageRep(data: tiff),
        let data = bitmap.representation(using: .png, properties: [:])
    else {
        throw NSError(domain: "generate.swift", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode PNG"])
    }
    try data.write(to: url)
}

func drawBlob(center: NSPoint, radius: CGFloat, fill: NSColor) {
    fill.setFill()
    let rect = NSRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2)
    NSBezierPath(ovalIn: rect).fill()
}

func scaledRect(_ x: CGFloat, _ y: CGFloat, _ width: CGFloat, _ height: CGFloat, in canvasSize: NSSize) -> NSRect {
    let sx = canvasSize.width / referenceCanvas.width
    let sy = canvasSize.height / referenceCanvas.height
    return NSRect(x: x * sx, y: y * sy, width: width * sx, height: height * sy)
}

func scaledPoint(_ x: CGFloat, _ y: CGFloat, in canvasSize: NSSize) -> NSPoint {
    let sx = canvasSize.width / referenceCanvas.width
    let sy = canvasSize.height / referenceCanvas.height
    return NSPoint(x: x * sx, y: y * sy)
}

func scaledValue(_ value: CGFloat, axis: String, in canvasSize: NSSize) -> CGFloat {
    switch axis {
    case "x":
        return value * (canvasSize.width / referenceCanvas.width)
    case "y":
        return value * (canvasSize.height / referenceCanvas.height)
    default:
        return value * min(canvasSize.width / referenceCanvas.width, canvasSize.height / referenceCanvas.height)
    }
}

func resolveInputURL(for filename: String) -> URL {
    let candidate = inputURL.appendingPathComponent(filename)
    if fileManager.fileExists(atPath: candidate.path) {
        return candidate
    }

    let stem = candidate.deletingPathExtension().lastPathComponent
    for ext in ["png", "jpg", "jpeg", "webp"] {
        let fallback = inputURL.appendingPathComponent("\(stem).\(ext)")
        if fileManager.fileExists(atPath: fallback.path) {
            return fallback
        }
    }

    return candidate
}

func outputName(for slide: Slide, suffix: String) -> String {
    guard !suffix.isEmpty else { return slide.output }
    let ext = (slide.output as NSString).pathExtension
    let stem = (slide.output as NSString).deletingPathExtension
    return "\(stem)\(suffix).\(ext)"
}

func renderSlide(_ slide: Slide, config: RenderConfig) throws {
    let canvasSize = config.canvasSize
    let image = NSImage(size: canvasSize)
    image.lockFocus()

    let ivory = color(hex: "#F7F1E8")
    ivory.setFill()
    NSBezierPath(rect: NSRect(origin: .zero, size: canvasSize)).fill()

    drawBlob(center: scaledPoint(1060, 2380, in: canvasSize), radius: scaledValue(290, axis: "min", in: canvasSize), fill: color(hex: slide.accent, alpha: 0.12))
    drawBlob(center: scaledPoint(170, 390, in: canvasSize), radius: scaledValue(250, axis: "min", in: canvasSize), fill: color(hex: "#D9B56E", alpha: 0.10))
    drawBlob(center: scaledPoint(970, 430, in: canvasSize), radius: scaledValue(170, axis: "min", in: canvasSize), fill: color(hex: slide.accent, alpha: 0.08))

    let borderColor = color(hex: "#E6DDD1")
    let logoShadow = NSShadow()
    logoShadow.shadowColor = color(hex: "#2D2418", alpha: 0.08)
    logoShadow.shadowBlurRadius = scaledValue(24, axis: "min", in: canvasSize)
    logoShadow.shadowOffset = NSSize(width: 0, height: -scaledValue(6, axis: "y", in: canvasSize))

    let logoCard = scaledRect(92, 2470, 96, 96, in: canvasSize)
    drawRoundedRect(logoCard, radius: scaledValue(28, axis: "min", in: canvasSize), fill: .white, shadow: logoShadow, stroke: borderColor)
    if let logo = NSImage(contentsOf: logoURL) {
        let inset = scaledValue(18, axis: "min", in: canvasSize)
        let logoRect = NSRect(x: logoCard.minX + inset, y: logoCard.minY + inset, width: scaledValue(60, axis: "min", in: canvasSize), height: scaledValue(60, axis: "min", in: canvasSize))
        logo.draw(in: logoRect)
    }

    drawText("ChefVision AI", rect: scaledRect(214, 2500, 420, 50, in: canvasSize), font: makeFont("Avenir Next Demi Bold", size: scaledValue(34, axis: "min", in: canvasSize), weight: .semibold), color: color(hex: "#1E1B16"))
    drawText(slide.badge, rect: scaledRect(92, 2340, 220, 44, in: canvasSize), font: makeFont("Avenir Next Demi Bold", size: scaledValue(20, axis: "min", in: canvasSize), weight: .semibold), color: color(hex: slide.accent))

    let badgeRect = scaledRect(78, 2330, 220, 54, in: canvasSize)
    drawRoundedRect(badgeRect, radius: scaledValue(27, axis: "min", in: canvasSize), fill: color(hex: slide.accent, alpha: 0.10))

    drawText(slide.badge, rect: scaledRect(118, 2342, 180, 26, in: canvasSize), font: makeFont("Avenir Next Demi Bold", size: scaledValue(20, axis: "min", in: canvasSize), weight: .semibold), color: color(hex: slide.accent))

    drawText(slide.title, rect: scaledRect(92, 2020, 860, 260, in: canvasSize), font: makeFont("Avenir Next Demi Bold", size: scaledValue(96, axis: "min", in: canvasSize), weight: .bold), color: color(hex: "#181512"), lineSpacing: scaledValue(8, axis: "y", in: canvasSize))
    drawText(slide.subtitle, rect: scaledRect(98, 1870, 730, 140, in: canvasSize), font: makeFont("Avenir Next Regular", size: scaledValue(34, axis: "min", in: canvasSize), weight: .regular), color: color(hex: "#655C53"), lineSpacing: scaledValue(6, axis: "y", in: canvasSize))

    let screenshotShadow = NSShadow()
    screenshotShadow.shadowColor = color(hex: "#201911", alpha: 0.12)
    screenshotShadow.shadowBlurRadius = scaledValue(60, axis: "min", in: canvasSize)
    screenshotShadow.shadowOffset = NSSize(width: 0, height: -scaledValue(20, axis: "y", in: canvasSize))

    let screenshotOuter = scaledRect(86, 134, 1070, 1600, in: canvasSize)
    drawRoundedRect(screenshotOuter, radius: scaledValue(72, axis: "min", in: canvasSize), fill: .white, shadow: screenshotShadow, stroke: borderColor)

    let frameInset = scaledValue(34, axis: "min", in: canvasSize)
    let screenshotFrame = NSRect(x: screenshotOuter.minX + frameInset, y: screenshotOuter.minY + frameInset, width: screenshotOuter.width - (frameInset * 2), height: screenshotOuter.height - (frameInset * 2))
    NSGraphicsContext.saveGraphicsState()
    roundedRectPath(screenshotFrame, radius: scaledValue(54, axis: "min", in: canvasSize)).addClip()

    let sourceURL = resolveInputURL(for: slide.input)
    if let screenshot = NSImage(contentsOf: sourceURL) {
        let fillRect = aspectFillRect(imageSize: screenshot.size, inside: screenshotFrame)
        screenshot.draw(in: fillRect)
    } else {
        let gradient = NSGradient(colors: [color(hex: "#FBF7F1"), color(hex: slide.accent, alpha: 0.18)])!
        gradient.draw(in: screenshotFrame, angle: -90)
        drawText("Drop \(slide.input) into marketing/app_store/input", rect: NSRect(x: screenshotFrame.minX + scaledValue(90, axis: "x", in: canvasSize), y: screenshotFrame.midY - scaledValue(40, axis: "y", in: canvasSize), width: screenshotFrame.width - scaledValue(180, axis: "x", in: canvasSize), height: scaledValue(120, axis: "y", in: canvasSize)), font: makeFont("Avenir Next Demi Bold", size: scaledValue(38, axis: "min", in: canvasSize), weight: .semibold), color: color(hex: "#3E362C"), alignment: .center, lineSpacing: scaledValue(4, axis: "y", in: canvasSize))
    }
    NSGraphicsContext.restoreGraphicsState()

    drawRoundedRect(scaledRect(92, 86, 220, 10, in: canvasSize), radius: scaledValue(5, axis: "min", in: canvasSize), fill: color(hex: slide.accent))
    drawRoundedRect(scaledRect(92, 60, 430, 2, in: canvasSize), radius: scaledValue(1, axis: "min", in: canvasSize), fill: color(hex: "#D8CCBD"))

    image.unlockFocus()
    try savePNG(image, to: outputURL.appendingPathComponent(outputName(for: slide, suffix: config.suffix)))
}

let data = try Data(contentsOf: slidesURL)
let slides = try JSONDecoder().decode([Slide].self, from: data)
try fileManager.createDirectory(at: outputURL, withIntermediateDirectories: true)

for config in renderConfigs {
    for slide in slides {
        try renderSlide(slide, config: config)
        print("Generated \(outputName(for: slide, suffix: config.suffix))")
    }
}
