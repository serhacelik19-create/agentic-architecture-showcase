import asyncio
import unittest

from main import MathRequest, calculate
from verification import verify_solution


def call_calculate(**payload):
    return asyncio.run(calculate(MathRequest(**payload)))


class MathContractTests(unittest.TestCase):
    def test_solve_system_infers_variables_from_expression(self):
        payload = call_calculate(
            action="solve_system",
            expression="x+y-8,x-y-2",
        )

        self.assertEqual(payload["status"], "success")
        self.assertIn("x: 5", payload["result"])
        self.assertIn("y: 3", payload["result"])
        self.assertEqual(payload["normalized_request"]["variable"], "x,y")
        self.assertTrue(payload["verification"]["is_verified"])

    def test_solve_system_overrides_wrong_default_variable_with_inference(self):
        payload = call_calculate(
            action="solve_system",
            expression="f+g-8,f-g-2",
            variable="x",
        )

        self.assertEqual(payload["status"], "success")
        self.assertIn("f: 5", payload["result"])
        self.assertIn("g: 3", payload["result"])
        self.assertEqual(payload["normalized_request"]["variable"], "f,g")
        self.assertTrue(payload["verification"]["is_verified"])

    def test_solve_system_accepts_structured_equations_payload(self):
        payload = call_calculate(
            action="solve_system",
            equations=["x+y-8", "x-y-2"],
            variables=["x", "y"],
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["normalized_request"]["expression"], "x+y-8, x-y-2")
        self.assertEqual(payload["normalized_request"]["variable"], "x,y")

    def test_limit_accepts_one_sided_point_notation(self):
        payload = call_calculate(
            action="limit",
            expression="1/x",
            variable="x",
            limit_point="0+",
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["result"], "oo")

    def test_invalid_assignment_list_returns_structured_error(self):
        payload = call_calculate(
            action="solve",
            expression="a = -5, b = -4, c = -3",
        )

        self.assertEqual(payload["status"], "error")
        self.assertEqual(payload["code"], "INVALID_SOLVE_INPUT")

    def test_matrix_structured_payload_works(self):
        payload = call_calculate(
            action="matrix",
            matrix=[[1, 2], [3, 4]],
            matrix_action="determinant",
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["result"], "-2")
        self.assertEqual(payload["normalized_request"]["variable"], "determinant")

    def test_coordinate_geometry_accepts_point_to_line_distance_aliases(self):
        payload = call_calculate(
            action="coordinate_geometry",
            variable="point_to_line_distance",
            params={"x1": 3, "y1": 4, "a": 3, "b": 4, "c": 0},
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["result"], "5")
        self.assertEqual(payload["normalized_request"]["variable"], "point_to_line_distance")

    def test_coordinate_geometry_accepts_point1_point2_aliases_for_line_equation(self):
        payload = call_calculate(
            action="coordinate_geometry",
            variable="line_equation",
            params={"point1": [2, 1], "point2": [2, 5]},
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["result"], "x = 2")
        self.assertEqual(payload["normalized_request"]["variable"], "line_equation")

    def test_coordinate_geometry_accepts_nested_operation_payload(self):
        payload = call_calculate(
            action="coordinate_geometry",
            params={"line_equation": {"p1": [2, 1], "p2": [2, 5]}},
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["result"], "x = 2")
        self.assertEqual(payload["normalized_request"]["variable"], "line_equation")

    def test_combinatorics_defaults_to_combination_when_variable_is_missing(self):
        payload = call_calculate(
            action="combinatorics",
            expression="10,3",
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["result"], "120")
        self.assertEqual(payload["normalized_request"]["variable"], "combination")

    def test_combinatorics_overrides_legacy_x_default(self):
        payload = call_calculate(
            action="combinatorics",
            expression="10,3",
            variable="x",
        )

        self.assertEqual(payload["status"], "success")
        self.assertEqual(payload["result"], "120")
        self.assertEqual(payload["normalized_request"]["variable"], "combination")

    def test_verify_solution_accepts_equivalent_line_equation(self):
        payload = verify_solution(
            "A(1,2) ve B(3,6) noktalarından geçen doğru",
            "y - 2*x",
            "y = 2x",
        )

        self.assertEqual(payload["status"], "success")
        self.assertTrue(payload["is_verified"])

    def test_verify_solution_rejects_constant_equation_for_root_list(self):
        payload = verify_solution(
            "sin(x)=0",
            "sin(0)",
            "[0, pi, 2*pi]",
        )

        self.assertEqual(payload["status"], "error")
        self.assertEqual(payload["code"], "NON_SYMBOLIC_EQUATION")

    def test_verify_solution_returns_structured_error_for_prose_solution(self):
        payload = verify_solution(
            "x^2 - 1 = 0",
            "x**2 - 1",
            "x = -1 ve x = 1 olarak bulunur",
        )

        self.assertEqual(payload["status"], "error")
        self.assertEqual(payload["code"], "UNPARSABLE_SOLUTION")

    def test_verify_solution_accepts_system_mapping(self):
        payload = verify_solution(
            "x+y=8 ve x-y=2",
            "x+y-8, x-y-2",
            "{x: 5, y: 3}",
        )

        self.assertEqual(payload["status"], "success")
        self.assertTrue(payload["is_verified"])

    def test_verify_solution_accepts_set_literal_for_root_list(self):
        payload = verify_solution(
            "|x+2| = 4",
            "Abs(x + 2) - 4",
            "{-6, 2}",
        )

        self.assertEqual(payload["status"], "success")
        self.assertTrue(payload["is_verified"])


if __name__ == "__main__":
    unittest.main()
