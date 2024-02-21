<?php

namespace App\Http\Controllers;

use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Response;
use \Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use Auth;

class ApiController extends Controller
{

	protected $statusCode = HttpResponse::HTTP_OK;

    public function getStatusCode()
    {
        return $this->statusCode;
    }

    public function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;
        return $this;
    }

	protected function paginationResponse(Paginator $paginate, $data, $message)
    {
        $this->statusCode = HttpResponse::HTTP_OK;
        $data = array_merge($data, [
            'paginator' => [
                'total_count'  => $paginate->total(),
                'total_pages' => ceil($paginate->total() / $paginate->perPage()),
                'current_page' => $paginate->currentPage(),
                'limit' => $paginate->perPage(),
            ]
        ]);

        return $this->apiResponse([
            'status' => 'success',
            'status' => $this->statusCode,
            'message' => $message,
            'data' => $data
        ]);
    }

	protected function errorResponse($message, $statusCode=null)
    {
        $this->statusCode = HttpResponse::HTTP_UNAUTHORIZED;
        return $this->apiResponse([
            'status' => 'error',
            'status' => $statusCode ?? $this->statusCode,
            'message' => $message,
        ]);
    }

	protected function response($data)
    {
        return $this->apiResponse($data);
    }

    protected function apiResponse($data, $headers = [])
    {
        return Response::json(
            $data, 
            $this->getStatusCode(), 
            $headers
        );
    }

}