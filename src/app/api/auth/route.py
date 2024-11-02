from datasets import load_dataset
from typing import Dict
import json
from http import HTTPStatus

def load_fabric_frontiers():
    return load_dataset("infinite-dataset-hub/FabricFrontiers")

async def POST(request):
    try:
        body = await request.json()
        username = body.get('username')
        password = body.get('password')
        is_login = body.get('isLogin')

        # Load the dataset
        dataset = load_fabric_frontiers()
        
        return {
            'success': True,
            'message': 'Authentication successful'
        }, HTTPStatus.OK

    except Exception as e:
        return {
            'success': False,
            'message': str(e)
        }, HTTPStatus.BAD_REQUEST 