from unstructured_client import UnstructuredClient
from unstructured_client.models.shared import PartitionParameters
from unstructured_client.models.errors import SDKError
from unstructured_client.models import operations, shared
from fastapi.encoders import jsonable_encoder
from typing import Optional
import os

async def extract_content_from_upload(file_bytes: bytes, filename: str) -> Optional[dict]:
    try:
        client = UnstructuredClient(os.getenv("UNSTRUCTURED_API_KRY"))
        partition_params = PartitionParameters(
            files={
                "content": file_bytes,  
                "file_name": filename  
            },
            strategy=shared.Strategy.HI_RES, 
            coordinates=True,  
            split_pdf_page=True, 
            split_pdf_allow_failed=True,
            split_pdf_concurrency_level=15
        )
        req = operations.PartitionRequest(partition_parameters=partition_params)
        response = await client.general.partition_async(request=req)
        
        if response.status_code == 200:
            return jsonable_encoder(response.elements) 
        else:
            print(f"Error: Received status code {response.status_code}")
            return None

    except SDKError as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"General Error: {e}")

    return None
