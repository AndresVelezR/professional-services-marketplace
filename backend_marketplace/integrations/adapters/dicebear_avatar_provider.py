from urllib.parse import urlencode


DICEBEAR_BASE_URL = 'https://api.dicebear.com/9.x/shapes/svg'
DICEBEAR_DEFAULT_SEED = 'profile'


def dicebear_avatar_url(seed: str) -> str:
    cleaned_seed = str(seed).strip() if seed else DICEBEAR_DEFAULT_SEED
    if not cleaned_seed:
        cleaned_seed = DICEBEAR_DEFAULT_SEED
    return f'{DICEBEAR_BASE_URL}?{urlencode({"seed": cleaned_seed, "backgroundColor": "f1f5f9"})}'
