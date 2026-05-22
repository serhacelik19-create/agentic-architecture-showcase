import asyncio
import unittest

from main import MathRequest, calculate


def call_calculate(**payload):
    return asyncio.run(calculate(MathRequest(**payload)))


HARD_YKS_GEOMETRY_CASES = [
    {
        "id": 1,
        "title": "Yansima Ile En Kisa Yol",
        "question": (
            "Koordinat duzleminde A(-8, 6) ve B(4, 10) noktalarinda bulunan iki hareketli, "
            "x ekseni uzerindeki ayni C noktasindan gecmek zorundadir. Buna gore AC + CB "
            "toplaminin en kucuk degeri kac birimdir?"
        ),
        "options": ["A) 20", "B) 8*sqrt(5)", "C) 2*sqrt(85)", "D) 6*sqrt(10)", "E) 10*sqrt(2)"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "shortest_path_via_x_axis",
            "params": {"x1": -8, "y1": 6, "x2": 4, "y2": 10},
        },
        "expected": "20",
    },
    {
        "id": 2,
        "title": "Kosegen Orta Noktasi",
        "question": (
            "ABCD dortgeninde kosegenlerden biri olan AC'nin uc noktalari A(-11, 7) ve C(5, -9) "
            "olarak veriliyor. Kosegenlerin kesim noktasi O, AC'yi ortaladigina gore O noktasinin "
            "koordinatlari asagidakilerden hangisidir?"
        ),
        "options": ["A) (-3, -1)", "B) (-2, 1)", "C) (-1, -2)", "D) (1, -1)", "E) (2, -3)"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "midpoint",
            "params": {"x1": -11, "y1": 7, "x2": 5, "y2": -9},
        },
        "expected": "(-3, -1)",
    },
    {
        "id": 3,
        "title": "Iki Noktadan Gecen Dogru",
        "question": (
            "A(-6, 11) ve B(2, -1) noktalarindan gecen d dogrusunun denklemi asagidakilerden hangisidir?"
        ),
        "options": ["A) y = 2*x - 1", "B) y = -3*x/2 + 2", "C) y = 2 - 3*x/2", "D) y = x + 5", "E) y = -2*x + 3"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "line_equation",
            "params": {"x1": -6, "y1": 11, "x2": 2, "y2": -1},
        },
        "expected": "y = 2 - 3*x/2",
    },
    {
        "id": 4,
        "title": "Noktadan Dogruya Uzaklik",
        "question": (
            "P(7, -5) noktasinin 4x + 3y - 13 = 0 dogrusuna olan uzakligi kac birimdir?"
        ),
        "options": ["A) 2", "B) 3", "C) 16/5", "D) 4", "E) 19/5"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "point_to_line_distance",
            "params": {"x0": 7, "y0": -5, "a": 4, "b": 3, "c": -13},
        },
        "expected": "0",
    },
    {
        "id": 5,
        "title": "Cember Ve Dogru Kesisimi",
        "question": (
            "Merkezi O(0, 0) olan ve yaricapi 5 birim olan cember ile y = -x + 5 dogrusu "
            "K ve L noktalarinda kesismektedir. Buna gore K ve L noktalarinin koordinatlari nelerdir?"
        ),
        "options": [
            "A) (0, 5) ve (5, 0)",
            "B) (-5, 0) ve (0, 5)",
            "C) (-3, 2) ve (3, 2)",
            "D) (-4, 1) ve (4, 1)",
            "E) (0, -5) ve (5, 0)",
        ],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "circle_line_intersection",
            "params": {"cx": 0, "cy": 0, "r": 5, "m": -1, "n": 5},
        },
        "expected": "[(0, 5), (5, 0)]",
    },
    {
        "id": 6,
        "title": "Y Ekseni Uzerinden En Kisa Yol",
        "question": (
            "A(9, -4) ve B(-3, 8) noktalarinda bulunan iki nokta arasinda, y ekseni uzerindeki "
            "bir M noktasindan gecen en kisa yol isteniyor. Buna gore AM + MB en az kac birimdir?"
        ),
        "options": ["A) 12*sqrt(2)", "B) 6*sqrt(5)", "C) 4*sqrt(13)", "D) 10*sqrt(2)", "E) 5*sqrt(10)"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "shortest_path_via_y_axis",
            "params": {"x1": 9, "y1": -4, "x2": -3, "y2": 8},
        },
        "expected": "6*sqrt(5)",
    },
    {
        "id": 7,
        "title": "Donusum Geometrisi Donme",
        "question": (
            "A(4, -10) noktasi orijin etrafinda saat yonunun tersine 90 derece donduruluyor. "
            "Olusan A' noktasinin koordinatlari asagidakilerden hangisidir?"
        ),
        "options": ["A) (10, 4)", "B) (-10, 4)", "C) (4, 10)", "D) (10, -4)", "E) (-4, -10)"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "rotation_2d",
            "params": {"x": 4, "y": -10, "angle": 90},
        },
        "expected": "(10, 4)",
    },
    {
        "id": 8,
        "title": "Dogruya Gore Simetri",
        "question": (
            "P(6, 2) noktasinin y = x dogrusuna gore simetrigi R noktasi olduguna gore "
            "R'nin koordinatlari nedir?"
        ),
        "options": ["A) (2, 6)", "B) (-2, 6)", "C) (6, 2)", "D) (2, -6)", "E) (-6, 2)"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "reflection_line",
            "params": {"x": 6, "y": 2, "m": 1, "n": 0},
        },
        "expected": "(2, 6)",
    },
    {
        "id": 9,
        "title": "Besgen Alani",
        "question": (
            "Koordinat duzleminde A(0, 0), B(8, 0), C(10, 4), D(6, 9) ve E(1, 6) "
            "noktalarinin birlestirilmesiyle elde edilen besgenin alani kac birimkaredir?"
        ),
        "options": ["A) 57", "B) 59", "C) 61", "D) 63", "E) 125/2"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "polygon_area",
            "params": {"points": [[0, 0], [8, 0], [10, 4], [6, 9], [1, 6]]},
        },
        "expected": "125/2",
    },
    {
        "id": 10,
        "title": "Uzaklik Ve Koku Sadelestirme",
        "question": (
            "A(-5, -2) ve B(7, 14) noktalarindan gecen bir dogru parcasi veriliyor. "
            "AB uzunlugu kac birimdir?"
        ),
        "options": ["A) 10", "B) 18", "C) 20", "D) 4*sqrt(17)", "E) 6*sqrt(13)"],
        "payload": {
            "action": "coordinate_geometry",
            "variable": "distance",
            "params": {"x1": -5, "y1": -2, "x2": 7, "y2": 14},
        },
        "expected": "20",
    },
]


class HardYksGeometrySetTests(unittest.TestCase):
    def test_hard_yks_geometry_set(self):
        for case in HARD_YKS_GEOMETRY_CASES:
            with self.subTest(case=case["id"], title=case["title"]):
                payload = call_calculate(**case["payload"])

                self.assertEqual(
                    payload["status"],
                    "success",
                    msg=f"Soru {case['id']} basarisiz oldu: {case['question']}",
                )
                self.assertEqual(
                    payload["result"],
                    case["expected"],
                    msg=f"Soru {case['id']} beklenen sonucu vermedi: {case['question']}",
                )
                self.assertTrue(
                    payload.get("steps"),
                    msg=f"Soru {case['id']} icin adimlar bos dondu.",
                )


if __name__ == "__main__":
    unittest.main()
