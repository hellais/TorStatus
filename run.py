from __future__ import with_statement

import Cookie
import base64
import binascii
import calendar
import datetime
import email.utils
import functools
import gzip
import hashlib
import hmac
import httplib
import itertools
import logging
import mimetypes
import os.path
import re
import stat
import sys
import time
import tornado
import traceback
import types
import urllib
import urlparse
import uuid

from tornado import escape
from tornado import locale
from tornado import stack_context
from tornado import template
from tornado.escape import utf8, _unicode
from tornado.util import b, bytes_type, import_object, ObjectDict

try:
    from io import BytesIO  # python 3
except ImportError:
    from cStringIO import StringIO as BytesIO  # python 2

from tornado import web, ioloop
from tornado.web import HTTPError
import datetime
import os

class LongStatic(web.StaticFileHandler):

    def get(self, path, include_body=True):
        if os.path.sep != "/":
            path = path.replace("/", os.path.sep)
        abspath = os.path.abspath(os.path.join(self.root, path))
        # os.path.abspath strips a trailing /
        # it needs to be temporarily added back for requests to root/
        if not (abspath + os.path.sep).startswith(self.root):
            raise HTTPError(403, "%s is not in root static directory", path)
        if os.path.isdir(abspath) and self.default_filename is not None:
            # need to look at the request.path here for when path is empty
            # but there is some prefix to the path that was already
            # trimmed by the routing
            if not self.request.path.endswith("/"):
                self.redirect(self.request.path + "/")
                return
            abspath = os.path.join(abspath, self.default_filename)
        if not os.path.exists(abspath):
            raise HTTPError(404)
        if not os.path.isfile(abspath):
            raise HTTPError(403, "%s is not a file", path)

        stat_result = os.stat(abspath)
        modified = datetime.datetime.fromtimestamp(stat_result[stat.ST_MTIME])

        mime_type, encoding = mimetypes.guess_type(abspath)
        if mime_type:
            self.set_header("Content-Type", mime_type)

        cache_time = self.get_cache_time(path, modified, mime_type)

        self.set_extra_headers(path)

        # Check the If-Modified-Since, and don't send the result if the
        # content has not been modified
        ims_value = self.request.headers.get("If-Modified-Since")
        if ims_value is not None:
            date_tuple = email.utils.parsedate(ims_value)
            if_since = datetime.datetime.fromtimestamp(time.mktime(date_tuple))
            #if if_since >= modified:
            #    self.set_status(304)
            #    return

        if not include_body:
            return
        file = open(abspath, "rb")
        try:
            self.write(file.read())
        finally:
            file.close()


rest_api = [(r"/(.*)", LongStatic, {"path": "./"})]

if __name__ == "__main__":
    application = web.Application(rest_api)
    application.listen(8888)
    print "Running on http://127.0.0.1:8888/index.html"
    ioloop.IOLoop.instance().start()
