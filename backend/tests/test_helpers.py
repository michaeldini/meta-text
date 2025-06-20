"""Helper functions for API tests."""


def assert_called_with_first_arg(mock_method, expected_first_arg):
    """Assert that a mock method was called with a specific first argument."""
    mock_method.assert_called_once()
    call_args = mock_method.call_args
    assert call_args[0][0] == expected_first_arg


def assert_called_with_first_two_args(mock_method, expected_first_arg, expected_second_arg):
    """Assert that a mock method was called with specific first two arguments."""
    mock_method.assert_called_once()
    call_args = mock_method.call_args
    assert call_args[0][0] == expected_first_arg
    assert call_args[0][1] == expected_second_arg


def assert_called_with_first_three_args(mock_method, expected_first_arg, expected_second_arg, expected_third_arg):
    """Assert that a mock method was called with specific first three arguments."""
    mock_method.assert_called_once()
    call_args = mock_method.call_args
    assert call_args[0][0] == expected_first_arg
    assert call_args[0][1] == expected_second_arg
    assert call_args[0][2] == expected_third_arg
